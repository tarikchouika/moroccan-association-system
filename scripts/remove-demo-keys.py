#!/usr/bin/env python3
"""إزالة مفاتيح حسابات الديمو (demoTitle/demoAccounts/demoNote) من القواميس الثمانية."""
import re
import sys
from pathlib import Path

DICT_DIR = Path("/home/z/my-project/src/lib/i18n/dictionaries")

def clean(path: Path) -> bool:
    src = path.read_text(encoding="utf-8")
    src2 = re.sub(r"\n\s*demoTitle:\s*\"[^\"]*\",", "", src)
    src2 = re.sub(r"\n\s*demoNote:\s*\"[^\"]*\",", "", src2)
    src2 = re.sub(r"\n\s*demoAccounts:\s*\[[^\]]*\],", "", src2, flags=re.S)
    if src2 != src:
        path.write_text(src2, encoding="utf-8")
        return True
    return False

def main() -> None:
    for f in sorted(DICT_DIR.glob("*.ts")):
        changed = clean(f)
        # تحقق من عدم بقاء أي أثر
        leftover = re.search(r"demoTitle|demoAccounts|demoNote", f.read_text(encoding="utf-8"))
        status = "CLEANED" if changed else ("LEFTOVER!" if leftover else "already-clean")
        print(f"{f.name}: {status}")

if __name__ == "__main__":
    main()
