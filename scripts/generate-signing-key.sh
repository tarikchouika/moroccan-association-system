#!/usr/bin/env bash
# ============================================================================
# توليد شهادة التوقيع الرقمي لتطبيق أندرويد — منصة مامب
# CN=TARIK CHOUIKA — صلاحية 30 سنة (10958 يوماً) — RSA 2048 / SHA-256
# المخزن يُحفظ في .secrets/ (غير متتبع في git) ولا تُطبع كلمة السر أبداً.
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

SECRETS_DIR=".secrets"
KEYSTORE="$SECRETS_DIR/mamp-release.p12"
ENV_FILE="$SECRETS_DIR/env"

mkdir -p "$SECRETS_DIR"

if [ -f "$KEYSTORE" ]; then
  echo "المخزن موجود مسبقاً: $KEYSTORE (لا يُعاد التوليد)"
  exit 0
fi

# كلمة سر عشوائية قوية (لا تُعرض)
PASS=$(openssl rand -base64 32 | tr -d '/+=' | head -c 32)

# إزالة أي إدخالات سابقة لهذه المتغيرات
sed -i '/^MAMP_KEYSTORE_PASSWORD=/d; /^MAMP_KEY_ALIAS=/d; /^MAMP_KEY_PASSWORD=/d' "$ENV_FILE"

echo "==> توليد الشهادة (CN=TARIK CHOUIKA، صلاحية 30 سنة)..."
keytool -genkeypair -v \
  -keystore "$KEYSTORE" \
  -storetype PKCS12 \
  -alias mamp \
  -keyalg RSA -keysize 2048 \
  -sigalg SHA256withRSA \
  -validity 10958 \
  -dname "CN=TARIK CHOUIKA, OU=MAMP Mobile, O=MAMP, L=Casablanca, C=MA" \
  -storepass "$PASS" \
  -keypass "$PASS" 2>&1 | grep -viE "enter|storing|^Generating|^$|\[Storing" || true

if [ ! -f "$KEYSTORE" ]; then
  echo "❌ فشل توليد المخزن" >&2
  exit 1
fi

# حفظ كلمة السر في ملف الأسرار المحلي (chmod 600)
touch "$ENV_FILE"
chmod 600 "$ENV_FILE"
cat >> "$ENV_FILE" << EOF
MAMP_KEYSTORE_PASSWORD=$PASS
MAMP_KEY_ALIAS=mamp
MAMP_KEY_PASSWORD=$PASS
EOF
chmod 600 "$ENV_FILE"

echo "==> ✓ تم توليد المخزن وحفظ كلمة السر في $ENV_FILE"

# عرض معلومات الشهادة للتحقق (بدون كلمة السر)
echo "==> معلومات الشهادة:"
keytool -list -v -keystore "$KEYSTORE" -storepass "$PASS" 2>/dev/null | grep -E "Alias name|Owner|Valid from|Signature alg" | sed 's/^/    /'
