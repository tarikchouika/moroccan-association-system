#!/usr/bin/env bash
# ============================================================================
# deploy-full.sh — نشر mamp.pages.dev الكامل (صفحات ثابتة + وكيل + عامل + D1)
#
# البنية (منذ v1.5.0):
#   • mamp.pages.dev (Cloudflare Pages):
#       - الأصول الثابتة أولاً: الصفحات العمومية (سرعة ومرونة كما كانت)
#       - public/_worker.js (وضع متقدم): وكيل يوجّه مسارات التطبيق
#         (/api/* و /login و /register و /dashboard) إلى العامل الكامل
#   • mamp-app (Cloudflare Workers + OpenNext): التطبيق الكامل بلوحة التحكم
#   • mamp-db (Cloudflare D1): قاعدة الإنتاج — السوبر أدمين فقط، لا حسابات تجريبية
#
# الاستعمال: bash scripts/deploy-full.sh
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .secrets/env ]; then
  echo "❌ الملف .secrets/env غير موجود (CF_ACCOUNT_ID / CF_API_TOKEN)" >&2
  exit 1
fi
# shellcheck disable=SC1091
source .secrets/env
export CLOUDFLARE_API_TOKEN="$CF_API_TOKEN"
export CLOUDFLARE_ACCOUNT_ID="$CF_ACCOUNT_ID"
export DATABASE_URL="file:$(pwd)/db/custom.db"

echo "==> [1/6] توليد عميلي Prisma (workerd للعامل + كلاسيكي للمحلي)"
bunx prisma generate --schema prisma/schema.prisma
bash scripts/fix-prisma-external.sh

echo "==> [2/6] بناء التطبيق الكامل (Next standalone)"
bunx --bun next build

echo "==> [3/6] حزم OpenNext للعامل + حقن وحدة WASM الثابتة"
npx opennextjs-cloudflare build
python3 scripts/patch-opennext-wasm.py

echo "==> [4/6] نشر العامل mamp-app على Workers"
npx wrangler deploy

echo "==> [5/6] بناء النسخة الثابتة العمومية (مع وكيل Pages)"
bash scripts/build-static.sh

echo "==> [6/6] نشر Pages (الأصول الثابتة + _worker.js)"
npx wrangler pages deploy out --project-name=mamp

echo ""
echo "تحقق إنتاجي..."
sleep 8
for p in "" "projects/" "associations/" "app/"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://mamp.pages.dev/$p")
  echo "    /$p → $CODE"
done
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://mamp.pages.dev/api/auth/login" \
  -H "Content-Type: application/json" -d '{"email":"probe@example.ma","password":"x"}')
echo "    /api/auth/login (probe) → $CODE (متوقع 401/400 — الوكيل حي)"

echo ""
echo "✅ اكتمل النشر الكامل: https://mamp.pages.dev"
