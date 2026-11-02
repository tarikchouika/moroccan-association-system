#!/usr/bin/env bash
# ============================================================================
# فحص الفيض الأفقي (overflow) عبر اللغات الثماني — مقاس الهاتف والديسكتوب
# لكل صفحة: scrollWidth مقابل clientWidth + عناصر خارجة عن الشاشة
# ============================================================================
set -uo pipefail
BASE="http://localhost:3000"
LANGS="ar fr en es it de nl ru"
PAGES="/ /projects /associations /assistant /legal /login"

fail=0

for LANG in $LANGS; do
  for PAGE in $PAGES; do
    agent-browser storage local set mamp-lang "$LANG" > /dev/null 2>&1
    agent-browser open "$BASE$PAGE" > /dev/null 2>&1
    agent-browser wait --load networkidle > /dev/null 2>&1
    sleep 0.6
    RES=$(agent-browser eval "
      (() => {
        const d = document.documentElement;
        const vw = d.clientWidth;
        const over = d.scrollWidth - vw;
        // عناصر بارزة تتجاوز حافة الشاشة (نستثني عناصر القوائم المنسدلة المخفية)
        const culprits = [];
        document.querySelectorAll('body *').forEach(el => {
          const r = el.getBoundingClientRect();
          const st = getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden' || r.width === 0) return;
          if (r.right > vw + 1.5 && r.width > 24) {
            culprits.push(el.tagName + '.' + String(el.className).split(' ')[0] + '@' + Math.round(r.right));
          }
        });
        return JSON.stringify({over, vw, n: culprits.length, c: culprits.slice(0, 3)});
      })()
    " 2>/dev/null | tail -1)
    OVER=$(echo "$RES" | python3 -c "import json,sys; d=json.loads(sys.stdin.read().strip('\"').encode().decode('unicode_escape') if False else json.loads(sys.stdin.read())); print()" 2>/dev/null; true)
    # استخراج مباشر أبسط:
    OVERVAL=$(echo "$RES" | grep -o '"over":[0-9-]*' | cut -d: -f2)
    CULPRITS=$(echo "$RES" | grep -o '"c":\[[^]]*\]' | head -c 200)
    if [ -z "$OVERVAL" ]; then
      echo "?? [$LANG] $PAGE — لم نقيس ($RES)"
      continue
    fi
    if [ "$OVERVAL" -gt 1 ]; then
      echo "❌ [$LANG] $PAGE — فيض ${OVERVAL}px | $CULPRITS"
      fail=$((fail+1))
    else
      echo "✓ [$LANG] $PAGE — سليم"
    fi
  done
done

echo "======================"
echo "النتيجة: $fail صفحة فيها فيض"
exit $fail
