# -*- coding: utf-8 -*-
"""نقل قسبي messages/articles من داخل settings إلى مستوى dash الصحيح"""
import re

LANGS = ["ar", "en", "fr", "es", "it", "de", "nl", "ru"]
for lang in LANGS:
    path = f"/home/z/my-project/src/lib/i18n/dictionaries/{lang}.ts"
    s = open(path, encoding="utf-8").read()

    # النمط الحالي الخاطئ: toastDocDeleted ثم القسمان ثم إغلاق settings ثم إغلاق dash
    pat = re.compile(
        r'(toastDocDeleted: "[^"]*",\n)'
        r'(    messages: \{.*?\n    \},\n)'
        r'(    articles: \{.*?\n    \},\n)'
        r'(    \},\n)'
        r'(  \},\n)',
        re.DOTALL,
    )
    m = pat.search(s)
    if not m:
        print(f"  ⚠️ {lang}: النمط غير موجود — قد يكون سليماً؟")
        continue
    fixed = m.group(1) + m.group(4) + m.group(2) + m.group(3) + m.group(5)
    s = s[: m.start()] + fixed + s[m.end():]
    open(path, "w", encoding="utf-8").write(s)
    print(f"  ✅ {lang}: نُقل القسمان إلى مستوى dash")
