#!/usr/bin/env bash
# ============================================================================
# build-static.sh — بناء النسخة الثابتة العمومية للنشر على Cloudflare Pages
# منصة مامب (MAMP) — إدارة الجمعيات المغربية
#
# المبدأ:
#   • النسخة الكاملة (API + لوحة التحكم + SQLite) تعمل على الخادم المحلي.
#   • هذه النسخة الثابتة تحمل الصفحات العمومية فقط + المساعد الجمعوي
#     (بوضع قاعدة المعارف الموثقة داخل المتصفح — بدون هلوسة).
# الاستعمال:
#   bash scripts/build-static.sh [--serve]   # --serve لمعاينة محلية عبر npx serve
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

EXCLUDE_DIR=".static-exclude"
OUT_DIR="out"

echo "==> [1/5] تحضير وضع التصدير الثابت (استثناء API ولوحة التحكم)"
mkdir -p "$EXCLUDE_DIR"
rm -rf "$EXCLUDE_DIR/api" "$EXCLUDE_DIR/dashboard"
[ -d src/app/api ] && mv src/app/api "$EXCLUDE_DIR/api" || true
[ -d src/app/dashboard ] && mv src/app/dashboard "$EXCLUDE_DIR/dashboard" || true

restore() {
  [ -d "$EXCLUDE_DIR/api" ] && rm -rf src/app/api && mv "$EXCLUDE_DIR/api" src/app/api || true
  [ -d "$EXCLUDE_DIR/dashboard" ] && rm -rf src/app/dashboard && mv "$EXCLUDE_DIR/dashboard" src/app/dashboard || true
  rmdir "$EXCLUDE_DIR" 2>/dev/null || true
}
trap restore EXIT

echo "==> [2/5] توليد البيانات العمومية من قاعدة SQLite المحلية"
# مسار قاعدة بيانات مطلق محسوب عند البناء — يعمل محلياً وعلى Vercel/CI
export DATABASE_URL="file:$(pwd)/db/custom.db"
bunx prisma generate --schema prisma/schema.prisma
bun run demo:generate

echo "==> [3/5] بناء النسخة الثابتة (next build + output=export)"
rm -rf "$OUT_DIR"
MAMP_EXPORT=1 bunx --bun next build

echo "==> [4/5] فحص المخرجات"
if [ ! -f "$OUT_DIR/index.html" ]; then
  echo "❌ فشل البناء: index.html غير موجود" >&2
  exit 1
fi
PAGES=$(find "$OUT_DIR" -name "*.html" | wc -l)
echo "    عدد الصفحات المولدة: $PAGES"

# صفحات وملفات مطلوبة يجب أن تتوفر
for p in index.html associations/index.html legal/index.html legal/terms/index.html legal/privacy/index.html legal/cookies/index.html assistant/index.html app/index.html login/index.html register/index.html sitemap.xml robots.txt manifest.webmanifest; do
  if [ ! -f "$OUT_DIR/$p" ]; then
    echo "❌ ملف مفقود: $p" >&2
    exit 1
  fi
done

echo "==> [5/6] توليد حزمة ZIP — نسخة الويب الكاملة (رابط كلاودفلير المباشر)"
python3 - <<'PYZIP'
import os, zipfile
OUT = "out"
zpath = os.path.join(OUT, "mamp-site-latest.zip")
if os.path.exists(zpath):
    os.remove(zpath)
count = 0
with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for root, dirs, files in os.walk(OUT):
        for f in sorted(files):
            p = os.path.join(root, f)
            if os.path.abspath(p) == os.path.abspath(zpath):
                continue
            z.write(p, os.path.relpath(p, OUT))
            count += 1
size_mb = os.path.getsize(zpath) / (1024 * 1024)
print(f"    ملفات مضغوطة: {count}")
print(f"    الحجم: {size_mb:.1f} م.ب")
print(f"    الرابط المباشر بعد النشر: https://mamp.pages.dev/mamp-site-latest.zip")
PYZIP

echo "==> [6/6] اكتمل البناء الثابت في: $OUT_DIR/"
echo ""
echo "للنشر على Cloudflare Pages:"
echo "  npx wrangler pages deploy $OUT_DIR --project-name=mamp"
echo "للمعاينة المحلية:"
echo "  npx serve $OUT_DIR"
