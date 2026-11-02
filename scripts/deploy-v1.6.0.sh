#!/usr/bin/env bash
# ============================================================================
# deploy-v1.6.0.sh — نشر إصدار MAMP v1.6.0 (الاسم الرسمي MAMP + طاقم المنصة
# + الوثائق الرسمية للتسجيل + قبول الانخراط بالتفويض + درع no-cache)
#
# التسلسل:
#   1) تطبيق ترحيل D1 (0002_approvals_delegation) على قاعدة الإنتاج عن بعد
#   2) النشر الكامل (عامل mamp-app + صفحات mamp.pages.dev عبر deploy-full.sh)
#   3) تحقق إنتاجي موسع: الصفحات + واجهة الدخول + ترويسات no-cache + الإدارة
#
# المتطلبات: .secrets/env يحوي CF_ACCOUNT_ID و CF_API_TOKEN (وAUTH_SECRET مضبوط
# كسر wrangler secret من قبل — لا يُلمس هنا).
#
# الاستعمال: bash scripts/deploy-v1.6.0.sh
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .secrets/env ]; then
  echo "❌ الملف .secrets/env غير موجود (CF_ACCOUNT_ID / CF_API_TOKEN)." >&2
  echo "   أعيدوا إنشاءه ثم شغلوا السكربت — كل الشيفرة جاهزة ومختبرة." >&2
  exit 1
fi
# shellcheck disable=SC1091
source .secrets/env
export CLOUDFLARE_API_TOKEN="$CF_API_TOKEN"
export CLOUDFLARE_ACCOUNT_ID="$CF_ACCOUNT_ID"

echo "==> [1/3] تطبيق ترحيل D1 (عمود تفويض قبول الانخراط) على الإنتاج"
npx wrangler d1 migrations apply mamp-db --remote

echo "==> [2/3] النشر الكامل (عامل + صفحات)"
bash scripts/deploy-full.sh

echo "==> [3/3] تحقق إنتاجي موسع"
sleep 10
echo "--- الصفحات العمومية ---"
for p in "" "projects/" "associations/" "app/" "login/" "register/"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://mamp.pages.dev/$p")
  echo "    /$p → $CODE"
done

echo "--- واجهة الدخول (وكيل حي) ---"
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://mamp.pages.dev/api/auth/login" \
  -H "Content-Type: application/json" -d '{"email":"probe@example.ma","password":"x"}')
echo "    /api/auth/login (probe) → $CODE (متوقع 401)"

echo "--- درع no-cache على HTML العامل (السبب الجذري لخلل التطبيق سابقاً) ---"
CC=$(curl -s -D - -o /dev/null "https://mamp.pages.dev/login" | grep -i "^cache-control" | tr -d "\r")
echo "    /login → $CC"
case "$CC" in
  *max-age=31536000*) echo "    ❌ لا يزال التخزين السنوي! راجعوا _worker.js" >&2; exit 1 ;;
  *) echo "    ✓ لا تخزين طويل المدى للـHTML" ;;
esac

echo "--- اسم المنصة في الإنتاج ---"
TITLE=$(curl -s "https://mamp.pages.dev/login/" | grep -o "<title>[^<]*</title>" | head -1)
echo "    $TITLE"

echo ""
echo "✅ اكتمل نشر v1.6.0: https://mamp.pages.dev"
echo "   بعد الدفع إلى GitHub يُبنى APK تلقائياً بالاسم الجديد (MAMP):"
echo "   https://github.com/tarikchouika/moroccan-association-system/releases/latest/download/mamp.apk"
