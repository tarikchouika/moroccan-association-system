#!/usr/bin/env python3
"""
fix-prisma-external.py — إصلاح استيراد تشغيل Prisma الخارجي لبيئة Workers.

المشكلة (طبقتان):
 1) العميل المولَّد (runtime=workerd) يستورد "@prisma/client/runtime/wasm-engine-edge"
    وNext 16 يُبقي @prisma/client خارجياً افتراضياً باسم مجزّأ (‎-2c3a283f134fdcb6)
    لا يحلّه wrangler (استيراد ديناميكي بمتغير وقت تشغيل يتجاوز alias).
 2) تحميل ملف query_engine_bg.wasm عبر محمّل Turbopack يستعمل fs.createReadStream
    وWebAssembly.compileStreaming — كلاهما غير متاح في workerd.
    (كلاودفلير Workers يمنع كل تركيب WASM الديناميكي أمنياً — الطريق الوحيد
     استيراد ثابت يعيد وحدة مصرَّفة مسبقاً.)

الحل (ثلاث خطوات):
 1) نسخ ملف التشغيل المستقل بجوار المولَّد وإعادة كتابة الاستيرادات لمسارات نسبية.
 2) محمّل الوحدة في class.ts يفحص أولاً globalThis.__MAMP_QUERY_WASM
    (وحدة ثابتة يحقنها scripts/patch-opennext-wasm.py بعد بناء OpenNext)
    وإلا سقط لمسار Turbopack الأصلي (يعمل في Node للتطوير المحلي).
 3) (منفصل) حقن ملف الحامل في .open-next — راجعوا patch-opennext-wasm.py.

يُنفَّذ بعد كل: prisma generate — عديم الأثر عند التكرار.
"""
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RUNTIME_SRC = ROOT / "node_modules/@prisma/client/runtime/wasm-engine-edge.mjs"
GEN = ROOT / "src/generated/prisma"
GLOBAL_KEY = "__MAMP_QUERY_WASM"

INJECTED_LOADER = f"""  getQueryEngineWasmModule: async () => {{
    // 1) وحدة ثابتة مصرَّفة مسبقاً (Workers يمنع التركيب الديناميكي) —
    //    يحقنها patch-opennext-wasm.py في globalThis.{GLOBAL_KEY}
    const injected = (globalThis as {{ {GLOBAL_KEY}?: WebAssembly.Module }}).{GLOBAL_KEY};
    if (injected) return injected;
    // 2) مسار Node/التطوير المحلي — محمّل Turbopack (fs + compileStreaming)
    const {{ default: module }} = await import("./query_engine_bg.wasm?module")
    return module
  }}"""

def main() -> int:
    if not RUNTIME_SRC.exists():
        print(f"❌ ملف التشغيل غير موجود: {RUNTIME_SRC}", file=sys.stderr)
        return 1
    if not (GEN / "client.ts").exists():
        print("❌ المولَّد غير موجود: شغّلوا prisma generate أولاً", file=sys.stderr)
        return 1

    # ---------- 1) نسخ التشغيل + إعادة كتابة الاستيرادات ----------
    shutil.copy(RUNTIME_SRC, GEN / "internal/wasm-engine-edge.mjs")

    rewrites = [
        (GEN.glob("*.ts"), "./internal/wasm-engine-edge.mjs"),
        (GEN.glob("internal/*.ts"), "./wasm-engine-edge.mjs"),
        (GEN.glob("models/*.ts"), "../internal/wasm-engine-edge.mjs"),
    ]
    for files, rel in rewrites:
        for f in files:
            src = f.read_text(encoding="utf-8")
            out = src.replace('"@prisma/client/runtime/wasm-engine-edge"', f'"{rel}"')
            if out != src:
                f.write_text(out, encoding="utf-8")

    leftover = [str(p) for p in GEN.rglob("*.ts")
                if "@prisma/client/runtime/wasm-engine-edge" in p.read_text(encoding="utf-8")]
    if leftover:
        print(f"❌ ما زالت {len(leftover)} ملفات تستورد مسار التشغيل الخارجي: {leftover[:3]}", file=sys.stderr)
        return 1

    # ---------- 2) محمّل وحدة WASM بحقن عالمي ----------
    class_ts = GEN / "internal/class.ts"
    src = class_ts.read_text(encoding="utf-8")

    if GLOBAL_KEY in src:
        print("ℹ️ محمّل الوحدة محقون مسبقاً — تخطي (idempotent)")
    else:
        # النمط المولَّد ثابت: من getQueryEngineWasmModule حتى القوس المغلق ذي المسافة البادئة
        pat = re.compile(
            r"getQueryEngineWasmModule:\s*async\s*\(\)\s*=>\s*\{.*?\n\s{2}\}",
            re.S,
        )
        src2, n = pat.subn(INJECTED_LOADER, src)
        if n != 1:
            print("❌ تعذر إيجاد نمط محمّل WASM في class.ts — راجعوا السكربت", file=sys.stderr)
            return 1
        class_ts.write_text(src2, encoding="utf-8")

    print("✅ حُزِّم تشغيل Prisma محلياً:")
    print(f"   - internal/wasm-engine-edge.mjs ({RUNTIME_SRC.stat().st_size // 1024} ك.ب)")
    print(f"   - محمّل الوحدة: globalThis.{GLOBAL_KEY} ← مسار Turbopack")
    return 0

if __name__ == "__main__":
    sys.exit(main())
