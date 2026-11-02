#!/usr/bin/env python3
"""توليد صور اختبار للرفع (PIL): صورة شخصية، لوغو، وثيقة هوية"""
from PIL import Image, ImageDraw
import os

os.makedirs("/tmp/uploads", exist_ok=True)

# صورة شخصية 512x512: قرص أزرق متدرج على خلفية فاتحة
img = Image.new("RGB", (512, 512), (240, 244, 250))
d = ImageDraw.Draw(img)
for r in range(220, 0, -4):
    d.ellipse([256 - r, 256 - r, 256 + r, 256 + r], fill=(30 + r // 10, 100 + r // 8, min(255, 160 + r // 6)))
img.save("/tmp/uploads/avatar.png", optimize=True)

# لوغو 512x512: درع أخضر
img = Image.new("RGB", (512, 512), (255, 255, 255))
d = ImageDraw.Draw(img)
d.rounded_rectangle([136, 116, 376, 396], radius=60, fill=(16, 128, 84))
d.rounded_rectangle([186, 176, 326, 346], radius=40, fill=(255, 255, 255))
img.save("/tmp/uploads/logo.png", optimize=True)

# وثيقة هوية 1280x800
img = Image.new("RGB", (1280, 800), (228, 222, 206))
d = ImageDraw.Draw(img)
d.rectangle([40, 60, 1240, 740], fill=(246, 242, 228))
for y in (130, 210, 290, 370):
    d.rectangle([90, y, 880, y + 26], fill=(70, 70, 80))
d.rounded_rectangle([950, 480, 1180, 700], radius=12, fill=(190, 158, 126))
d.rounded_rectangle([90, 470, 420, 700], radius=12, fill=(140, 168, 200))
img.save("/tmp/uploads/idcard.png", optimize=True)

for f in ("avatar.png", "logo.png", "idcard.png"):
    p = f"/tmp/uploads/{f}"
    print(f"{f}: {os.path.getsize(p)} bytes")
