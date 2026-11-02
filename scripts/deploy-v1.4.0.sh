#!/usr/bin/env bash
# ============================================================================
# نشر v1.4.0 — بعد استعادة بيانات الاعتماد في .secrets/env
#   CF_ACCOUNT_ID=...  CF_API_TOKEN=...  GITHUB_TOKEN=...
# الاستعمال: bash scripts/deploy-v1.4.0.sh
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .secrets/env ]; then
  echo "❌ الملف .secrets/env غير موجود — أنشئوه بالصيغة:"
  echo "   CF_ACCOUNT_ID=..."
  echo "   CF_API_TOKEN=..."
  echo "   GITHUB_TOKEN=..."
  exit 1
fi

# shellcheck disable=SC1091
source .secrets/env
export CLOUDFLARE_API_TOKEN="$CF_API_TOKEN"
export CLOUDFLARE_ACCOUNT_ID="$CF_ACCOUNT_ID"

echo "==> [1/3] نشر النسخة الثابتة (out/) على Cloudflare Pages"
npx wrangler pages deploy out --project-name=mamp

echo "==> [2/3] تحقق إنتاجي"
sleep 5
for p in "" "projects/" "associations/" "assistant/" "legal/"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://mamp.pages.dev/$p")
  echo "    /$p → $CODE"
done

echo "==> [3/3] الدفع إلى GitHub"
git push origin main

echo ""
echo "✅ اكتمل نشر v1.4.0: https://mamp.pages.dev"
