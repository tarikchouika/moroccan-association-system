#!/usr/bin/env python3
"""
رفع أسرار كلاودفلير إلى GitHub Actions Secrets — منصة مامب
يرفع CLOUDFLARE_API_TOKEN و CLOUDFLARE_ACCOUNT_ID من .secrets/env
(القيمتان CF_API_TOKEN و CF_ACCOUNT_ID محلياً) كي ينشر سير عمل APK
الرابط المباشر mamp-dl.pages.dev تلقائياً. لا يطبع أي قيمة سرية.
التنفيذ: python3 scripts/set-gh-cf-secrets.py
"""
import base64
import json
import os
import sys
import urllib.request
from nacl import encoding, public

REPO = "tarikchouika/moroccan-association-system"
ENV_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".secrets/env")


def load_env():
    values = {}
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                values[k.strip()] = v.strip()
    return values


def api(method, path, token, body=None):
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
        },
        data=json.dumps(body).encode() if body else None,
    )
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode() or "{}")


def main():
    env = load_env()
    token = env.get("GITHUB_TOKEN")
    if not token:
        print("❌ GITHUB_TOKEN غير موجود في .secrets/env")
        sys.exit(1)

    secrets = {
        "CLOUDFLARE_API_TOKEN": env.get("CF_API_TOKEN"),
        "CLOUDFLARE_ACCOUNT_ID": env.get("CF_ACCOUNT_ID"),
    }
    missing = [k for k, v in secrets.items() if not v]
    if missing:
        print(f"❌ قيم مفقودة في .secrets/env: {missing}")
        sys.exit(1)

    status, pk = api("GET", f"/repos/{REPO}/actions/secrets/public-key", token)
    if status != 200:
        print(f"❌ تعذر جلب المفتاح العمومي ({status}): {pk.get('message')}")
        sys.exit(1)

    repo_key = public.PublicKey(pk["key"].encode(), encoding.Base64Encoder())
    sealed = public.SealedBox(repo_key)

    ok = 0
    for name, value in secrets.items():
        encrypted = sealed.encrypt(value.encode())
        body = {
            "encrypted_value": base64.b64encode(encrypted).decode(),
            "key_id": pk["key_id"],
        }
        status, resp = api("PUT", f"/repos/{REPO}/actions/secrets/{name}", token, body)
        mark = "✓" if status in (201, 204) else "✗"
        print(f"  {mark} {name}: HTTP {status}")
        if status in (201, 204):
            ok += 1

    if ok == len(secrets):
        print(f"==> ✅ رُفعت أسرار كلاودفلير ({ok}/{len(secrets)}) بنجاح")
    else:
        print("==> ❌ فشل رفع بعض الأسرار")
        sys.exit(1)


if __name__ == "__main__":
    main()
