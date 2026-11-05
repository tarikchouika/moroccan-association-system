# -*- coding: utf-8 -*-
"""
add-v17-i18n.py — إدخال أقسام v1.7.0 في القواميس الثمانية
• nav: messages + articles
• associationDetail: مفاتيح استقبال التبرعات (بعد heroImageAlt الأول)
• dash: قسما messages و articles (بعد نهاية قسم settings)
"""
import re, sys, importlib.util

def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

base = "/home/z/my-project/scripts/"
m1 = load(base + "i18n-v17-data-ar-en.py", "d1")
m2 = load(base + "i18n-v17-data-fr-es-it.py", "d2")
m3 = load(base + "i18n-v17-data-de-nl-ru.py", "d3")

def merge(*parts):
    out = {}
    for p in parts:
        out.update(p)
    return out

NAV = merge(m1.NAV, m2.NAV, m3.NAV)
DETAIL = merge(m1.DETAIL, m2.DETAIL, m3.DETAIL)
MESSAGES = merge(m1.MESSAGES, m2.MESSAGES, m3.MESSAGES)
ARTICLES = merge(m1.ARTICLES, m2.ARTICLES, m3.ARTICLES)

LANGS = ["ar", "en", "fr", "es", "it", "de", "nl", "ru"]

def ts_value(v):
    return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'

def emit_block(section, data, indent=4):
    """يولد كتلة TS بأسلوب ملفات القواميس"""
    pad = " " * indent
    lines = [f"{pad}{section}: {{"]
    for k, v in data.items():
        if isinstance(v, dict):
            lines.append(f"{pad}  {k}: {{")
            for k2, v2 in v.items():
                lines.append(f"{pad}    {k2}: {ts_value(v2)},")
            lines.append(f"{pad}  }},")
        else:
            lines.append(f"{pad}  {k}: {ts_value(v)},")
    lines.append(f"{pad}}},")
    return "\n".join(lines)

ok = True
for lang in LANGS:
    path = f"/home/z/my-project/src/lib/i18n/dictionaries/{lang}.ts"
    s = open(path, encoding="utf-8").read()
    orig = s

    # حماية من التكرار: تخطَّ اللغة إن كانت مُرقّعة مسبقاً
    if "messages: {" in s.split("dash: {")[-1]:
        print(f"  ⏭️ {lang}: مُرقّع مسبقاً — تخطي")
        continue

    # ① nav: إدراج messages/articles قبل settings داخل nav
    nav_re = re.compile(r'(nav: \{\n(?:\s+\w+: "[^\n]*\n)+)(\s+)(settings:)')
    def nav_sub(m):
        body = m.group(1)
        add = f'{m.group(2)}messages: {ts_value(NAV[lang]["messages"])},\n{m.group(2)}articles: {ts_value(NAV[lang]["articles"])},\n'
        return body + add + m.group(2) + m.group(3)
    s, n1 = nav_re.subn(nav_sub, s, count=1)

    # ② associationDetail: بعد heroImageAlt الأول (سطر واحد أو متعدد الأسطر)
    hd_re = re.compile(r'(heroImageAlt:[ \t]*(?:"[^"]*"|\n\s*"[^"]*"),\n)')
    detail_lines = "".join(
        f'      {k}: {ts_value(v)},\n' for k, v in DETAIL[lang].items()
    )
    s, n2 = hd_re.subn(lambda m: m.group(1) + detail_lines, s, count=1)

    # ③ dash: قسما messages و articles بعد toastDocDeleted
    td_re = re.compile(r'(toastDocDeleted: "[^"\n]*",\n)')
    block = emit_block("messages", MESSAGES[lang]) + "\n" + emit_block("articles", ARTICLES[lang]) + "\n"
    s, n3 = td_re.subn(lambda m: m.group(1) + block, s, count=1)

    if n1 != 1 or n2 != 1 or n3 != 1:
        print(f"  ❌ {lang}: nav={n1} detail={n2} dash={n3} — لم يُدرج")
        ok = False
        continue
    if s != orig:
        open(path, "w", encoding="utf-8").write(s)
        print(f"  ✅ {lang}: أُدرجت الأقسام")
    else:
        print(f"  ⚠️ {lang}: لا تغيير")

sys.exit(0 if ok else 1)
