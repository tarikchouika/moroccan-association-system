#!/usr/bin/env bash
# غلاف — الشغل الفعلي في fix-prisma-external.py (راجعوا توثيقه للتفصيل)
set -euo pipefail
cd "$(dirname "$0")/.."
exec python3 scripts/fix-prisma-external.py
