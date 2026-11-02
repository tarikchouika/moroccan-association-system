#!/usr/bin/env python3
"""
patch-opennext-wasm.py — حقن وحدة WASM الثابتة في عامل OpenNext بعد البناء.

كلاودفلير Workers يمنع كل تركيب WASM الديناميكي (new WebAssembly.Module /
WebAssembly.compile → «Wasm code generation disallowed by embedder»).
الطريق الوحيد: استيراد ثابت لملف .wasm يسلّمنا التشغيل وحدة مصرَّفة مسبقاً.

المشكلة: استيراد .wasm داخل شيفرة التطبيق يمر عبر Turbopack أولاً فيحوّله
لمحمّل node غير الصالح. الحل: ملف حامل بسيط بجوار عامل OpenNext يستورد
الملف الثابت (يراه wrangler لا Turbopack) ويضعه في globalThis.__MAMP_QUERY_WASM
الذي يفحصه محمّل العميل المولَّد (fix-prisma-external.py).

الخطوات:
 1) إيجاد مقطع WASM الذي أصدَره Turbopack لمحرك الاستعلامات.
 2) كتابة .open-next/mamp-wasm-holder.js باستيراد ثابت + تعيين globalThis.
 3) حقن استيراد الحامل في رأس .open-next/worker.js (عديم الأثر عند التكرار).

يُنفَّذ بين opennextjs-cloudflare build و wrangler deploy.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OPEN_NEXT = ROOT / ".open-next"
CHUNKS = OPEN_NEXT / "server-functions/default/.next/server/chunks"
WORKER_JS = OPEN_NEXT / "worker.js"
HOLDER = OPEN_NEXT / "mamp-wasm-holder.js"
GLOBAL_KEY = "__MAMP_QUERY_WASM"
HOLDER_IMPORT = 'import "./mamp-wasm-holder.js";'

def find_query_wasm() -> Path | None:
    """مقطع wasm محرك الاستعلامات — نسخة غير ssr إن وُجدت (المستعملة في الخادم)."""
    if not CHUNKS.exists():
        return None
    candidates = sorted(CHUNKS.glob("*query_engine_bg*.wasm"))
    non_ssr = [c for c in candidates if "ssr" not in str(c)]
    pool = non_ssr or candidates
    return pool[0] if pool else None

def main() -> int:
    wasm = find_query_wasm()
    if wasm is None:
        print("❌ لم يُعثر على مقطع WASM لمحرك الاستعلامات في مخرجات OpenNext", file=sys.stderr)
        print("   تأكدوا من تشغيل fix-prisma-external.py قبل next build", file=sys.stderr)
        return 1

    if not WORKER_JS.exists():
        print(f"❌ {WORKER_JS} غير موجود — شغّلوا opennextjs-cloudflare build أولاً", file=sys.stderr)
        return 1

    # 1) ملف الحامل — استيراد ثابت يراه wrangler (لا Turbopack)
    rel = wasm.relative_to(OPEN_NEXT).as_posix()
    holder_src = (
        "// مولَّد آلياً — حامل وحدة WASM لمحرك استعلامات Prisma على كلاودفلير Workers\n"
        f'import queryWasm from "./{rel}";\n'
        f"globalThis.{GLOBAL_KEY} = queryWasm;\n"
    )
    HOLDER.write_text(holder_src, encoding="utf-8")

    # 2) حقن الاستيراد في رأس العامل (عديم الأثر عند التكرار)
    worker_src = WORKER_JS.read_text(encoding="utf-8")
    if HOLDER_IMPORT not in worker_src:
        lines = worker_src.split("\n")
        # أول سطر ليس تعليقاً — ندرج بعده
        idx = 0
        for i, ln in enumerate(lines[:10]):
            if ln.startswith("//"):
                idx = i + 1
                continue
            break
        lines.insert(idx, HOLDER_IMPORT)
        WORKER_JS.write_text("\n".join(lines), encoding="utf-8")
        action = "حُقِن"
    else:
        action = "مح inject مسبقاً"

    size_kb = wasm.stat().st_size // 1024
    print(f"✅ {action} حامل WASM: {wasm.name} ({size_kb} ك.ب) ← globalThis.{GLOBAL_KEY}")

    # 3) استبعاد _worker.js (خاص بـ Pages) من أصول العامل —
    #    wrangler يرفض رفع ملف بهذا الاسم كأصل (اسم محجوز)
    pages_worker = OPEN_NEXT / "assets/_worker.js"
    if pages_worker.exists():
        pages_worker.unlink()
        print("✅ حُذف assets/_worker.js من أصول العامل (خاص بـ Pages)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
