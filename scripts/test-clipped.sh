#!/usr/bin/env bash
# ============================================================================
# ماسح النصوص المقصوصة: عناصر محتواها أعرض من حاويتها بلا إمكانية تمرير
# (كشف «التشوه وعدم التناسق» عند تبديل اللغة)
# الاستعمال: bash scripts/test-clipped.sh [viewport: mobile|desktop]
# ============================================================================
set -uo pipefail
BASE="http://localhost:3000"
LANGS="ar fr en es it de nl ru"
PAGES="/ /projects /associations /assistant /legal /login /register /app"
VP="${1:-mobile}"

if [ "$VP" = "desktop" ]; then
  agent-browser set viewport 1366 900 > /dev/null 2>&1
else
  agent-browser set device "iPhone 14" > /dev/null 2>&1
fi

JS="
(() => {
  const bad = [];
  document.querySelectorAll('body *').forEach(el => {
    if (el.clientWidth <= 0 || el.children.length > 40) return;
    const s = getComputedStyle(el);
    const ox = s.overflowX;
    if (ox === 'auto' || ox === 'scroll') return;            // قابل للتمرير بالتصميم
    if (el.closest('[data-radix-scroll-area-viewport]')) return;
    if (el.tagName === 'TEXTAREA' || el.tagName === 'PRE') return;
    // شارات زاوية مطلقة الموضع تبرز عمداً خارج الحاوية — نمط تصميمي مقصود
    let hasAbs = false;
    for (const ch of el.children) {
      if (getComputedStyle(ch).position === 'absolute') { hasAbs = true; break; }
    }
    if (hasAbs) return;
    const clip = el.scrollWidth - el.clientWidth;
    if (clip > 3) {
      bad.push({t: el.tagName, c: String(el.className).slice(0, 40), txt: (el.textContent||'').trim().slice(0, 30), clip});
    }
  });
  return JSON.stringify(bad.slice(0, 5));
})()
"

total=0
for PAGE in $PAGES; do
  for LANG in $LANGS; do
    agent-browser storage local set mamp-lang "$LANG" > /dev/null 2>&1
    agent-browser open "$BASE$PAGE" > /dev/null 2>&1
    agent-browser wait --load networkidle > /dev/null 2>&1
    sleep 0.35
    RAW=$(agent-browser eval "$JS" 2>/dev/null | tail -1)
    N=$(echo "$RAW" | python3 -c "
import sys, json
raw = sys.stdin.read().strip()
try:
    s = raw[1:-1] if raw.startswith('\"') else raw
    s = s.encode('utf-8').decode('unicode_escape')
    arr = json.loads(s)
    print(len(arr))
    for x in arr[:3]:
        print('   ', x['t'], '|', x['c'][:30], '|', x['txt'][:25], '| clip', x['clip'])
except Exception as e:
    print('parse-error')
")
    if [ "$N" = "parse-error" ]; then
      echo "?? $PAGE [$LANG]"
    elif [ "$N" = "0" ]; then
      echo "✓ $PAGE [$LANG]"
    else
      echo "❌ $PAGE [$LANG] — $N عنصر مقصوص:"
      echo "$N" | tail -n +2
      total=$((total+1))
    fi
  done
done
echo "======== [$VP] صفحات فيها قص: $total ========"
