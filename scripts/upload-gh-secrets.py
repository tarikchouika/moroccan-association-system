#!/usr/bin/env python3
"""رفع أسرار المستودع إلى GitHub (تشفير libsodium المطلوب من واجهة الأسرار)."""
import base64
import json
import os
import sys
import urllib.request
from nacl import encoding, public

REPO = "tarikchouika/moroccan-association-system"
TOKEN = None
for line in open("/home/z/my-project/.secrets/env"):
    if line.startswith("GITHUB_TOKEN="):
        TOKEN = line.strip().split("=", 1)[1]
if not TOKEN:
    sys.exit("GITHUB_TOKEN غير موجود في .secrets/env")

API = f"https://api.github.com/repos/{REPO}"


def api(method: str, path: str, body=None):
    req = urllib.request.Request(
        API + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")


# 1) مفتاح المستودع العمومي
status, key_data = api("GET", "/actions/secrets/public-key")
if status != 200:
    sys.exit(f"فشل جلب المفتاح العمومي: {status} {key_data}")
print(f"✓ مفتاح المستودع: id={key_data['key_id']}")

pk = public.PublicKey(key_data["key"].encode(), encoding.Base64Encoder())
sealed = public.SealedBox(pk)

# 2) الأسرار المطلوبة
keystore_b64 = base64.b64encode(open("/home/z/my-project/.secrets/mamp-release.p12", "rb").read()).decode()
cf = {}
for line in open("/home/z/my-project/.secrets/env"):
    if "=" in line:
        k, v = line.strip().split("=", 1)
        cf[k] = v

secrets = {
    "MAMP_KEYSTORE_BASE64": keystore_b64,
    "MAMP_KEYSTORE_PASSWORD": "MampSign@2026",
    "MAMP_KEY_ALIAS": "mamp",
    "MAMP_KEY_PASSWORD": "MampSign@2026",
    "CLOUDFLARE_API_TOKEN": cf.get("CF_API_TOKEN", ""),
    "CLOUDFLARE_ACCOUNT_ID": cf.get("CF_ACCOUNT_ID", ""),
}

# 3) الرفع
for name, value in secrets.items():
    if not value:
        print(f"⚠️ {name}: قيمة فارغة — تخطٍّ")
        continue
    enc = sealed.encrypt(value.encode())
    status, resp = api(
        "PUT",
        f"/actions/secrets/{name}",
        {"encrypted_value": base64.b64encode(enc).decode(), "key_id": key_data["key_id"]},
    )
    mark = "✓" if status in (201, 204) else "✗"
    print(f"{mark} {name}: {status}")
    if status not in (201, 204):
        sys.exit(f"فشل رفع {name}: {resp}")

print("\nتم رفع كل الأسرار بنجاح ✅")
