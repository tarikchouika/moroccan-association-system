#!/usr/bin/env bash
# ============================================================================
# فحص الفيض الحقيقي: أقصى حافة يمنى لعناصر التدفق (غير fixed) لكل لغة
# + إمكانية التمرير الأفقي الفعلية (scrollX)
# ============================================================================
set -uo pipefail
BASE="http://localhost:3000"
LANGS="ar fr en es it de nl ru"
PAGES="/ /projects /associations /assistant /legal /login /app /register"

total_real=0
for PAGE in $PAGES; do
  line="[$PAGE]"
  for LANG in $LANGS; do
    agent-browser storage local set mamp-lang "$LANG" > /dev/null 2>&1
    agent-browser open "$BASE$PAGE" > /dev/null 2>&1
    agent-browser wait --load networkidle > /dev/null 2>&1
    sleep 0.4
    RES=$(agent-browser eval "
      (() => {
        const vw = document.documentElement.clientWidth;
        let maxR = 0, maxEl = '';
        document.querySelectorAll('body *').forEach(el => {
          const s = getComputedStyle(el);
          if (s.position === 'fixed' || s.display === 'none' || s.visibility === 'hidden') return;
          const r = el.getBoundingClientRect();
          if (r.width < 8) return;
          if (r.right > maxR) { maxR = r.right; maxEl = el.tagName + '.' + String(el.className).split(' ')[0]; }
        });
        window.scrollTo(500, 0);
        const sx = window.scrollX;
        window.scrollTo(0, 0);
        return JSON.stringify({over: Math.round(maxR - vw), el: maxEl, sx});
      })()
    " 2>/dev/null | tail -1)
    OVER=$(echo "$RES" | sed 's/.*"over":\(-\?[0-9]*\).*/\1/')
    SX=$(echo "$RES" | sed 's/.*"sx":\(-\?[0-9]*\).*/\1/')
    if [ -z "$OVER" ]; then line="$LANG=?"; continue; fi
    if [ "$OVER" -gt 1 ]; then
      line="$LANG:❌${OVER}px"
      total_real=$((total_real+1))
    else
      line="$LANG:✓"
    fi
    echo "$line ($SX)"
  done
done
echo "====== إجمالي حالات الفيض الحقيقي: $total_real ======"
