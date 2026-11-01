#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
توليد أصول اللوغو الجديد لمنصة مامب — من الملف الأصلي عالي الدقة:
  • public/logo.png            — اللوغو الأصلي (للخلفيات الفاتحة)
  • public/logo-dark.png       — نسخة مرتفعة الظلال (للخلفيات القاتمة)
  • public/icon-192/512.png    — أيقونات PWA مربعة
  • public/icon-512-maskable   — أيقونة قابلة للقنعة (منطقة أمان)
  • public/apple-icon.png      — أيقونة Apple (180)
  • public/favicon.ico         — فيڤيكون متعدد الأحجام
  • app-android/res/mipmap-*   — أيقونات الإطلاق لكل الكثافات
  • app-android/.../ic_launcher_foreground.png — طبقة أمامية للأيقونة التكيفية
  • app-android/.../ic_splash_logo.png         — شعار شاشة البداية (نسخة داكنة)
"""
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = "/home/z/my-project"
SRC = os.path.join(ROOT, "upload/logo/logo_download")
PUB = os.path.join(ROOT, "public")
RES = os.path.join(ROOT, "app-android/app/src/main/res")

# ألوان الهوية المستخرجة من اللوغو
NAVY_TOP = (7, 20, 49)       # #071431
NAVY_BOTTOM = (14, 58, 124)  # #0E3A7C
LIFT_MAX_L = 110             # حد رفع الظلال
LIFT_AMOUNT = 0.55           # نسبة الرفع

os.makedirs(PUB, exist_ok=True)


def trim(img):
    return img.crop(img.getbbox())


def lift_shadows(img):
    """رفع الظلال الداكنة جداً كي تبقى مرئية على الخلفيات القاتمة."""
    import numpy as np
    arr = np.asarray(img.convert("RGBA")).astype("float32")
    rgb = arr[..., :3]
    alpha = arr[..., 3]
    lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    mask = lum < LIFT_MAX_L
    target = lum + (LIFT_MAX_L - lum) * LIFT_AMOUNT
    scale = np.where(mask & (lum > 0.5), target / np.maximum(lum, 0.5), 1.0)
    # حدود ناعمة بين 100 و125
    fade = np.clip((125 - lum) / 25.0, 0, 1)
    scale = 1.0 + (scale - 1.0) * fade
    out = np.clip(rgb * scale[..., None], 0, 255)
    outa = np.dstack([out, alpha])
    return Image.fromarray(outa.astype("uint8"), "RGBA")


def gradient_bg(w, h, top=NAVY_TOP, bottom=NAVY_BOTTOM):
    """خلفية متدرجة عمودية كحلي→أزرق."""
    base = Image.new("RGB", (w, h))
    px = base.load()
    for y in range(h):
        t = y / max(1, h - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        for x in range(w):
            px[x, y] = (r, g, b)
    return base.convert("RGBA")


def make_square_icon(size, logo, ratio=0.72, rounded=False, glow=True):
    """أيقونة مربعة: خلفية كحلية متدرجة + اللوغو في الوسط."""
    canvas = gradient_bg(size, size)
    if glow:
        # توهج أزرق سماوي خفيف خلف الشعار
        glow_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow_layer)
        r = int(size * 0.34)
        gd.ellipse(
            [size // 2 - r, int(size * 0.18), size // 2 + r, int(size * 0.62)],
            fill=(0, 144, 248, 70),
        )
        glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(size * 0.08))
        canvas = Image.alpha_composite(canvas, glow_layer)

    # تركيب اللوغو في الوسط
    target = int(size * ratio)
    lw, lh = logo.size
    if lw / lh >= 1:
        nw = target
        nh = int(target * lh / lw)
    else:
        nh = target
        nw = int(target * lw / lh)
    mark = logo.resize((nw, nh), Image.LANCZOS)
    canvas.alpha_composite(mark, ((size - nw) // 2, (size - nh) // 2))

    if rounded:
        mask = Image.new("L", (size, size), 0)
        d = ImageDraw.Draw(mask)
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.22), fill=255)
        canvas.putalpha(mask)
    return canvas


def main():
    src = Image.open(SRC).convert("RGBA")
    logo = trim(src)
    print(f"اللوغو الأصلي: {logo.size}")

    # ===== 1) نسختا اللوغو =====
    logo.save(os.path.join(PUB, "logo.png"), optimize=True)
    logo_dark = lift_shadows(logo)
    logo_dark.save(os.path.join(PUB, "logo-dark.png"), optimize=True)
    print("✓ logo.png + logo-dark.png")

    # ===== 2) أيقونات الويب =====
    make_square_icon(192, logo).save(os.path.join(PUB, "icon-192.png"), optimize=True)
    icon512 = make_square_icon(512, logo)
    icon512.save(os.path.join(PUB, "icon-512.png"), optimize=True)
    make_square_icon(512, logo, ratio=0.60).save(
        os.path.join(PUB, "icon-512-maskable.png"), optimize=True)
    make_square_icon(180, logo).save(os.path.join(PUB, "apple-icon.png"), optimize=True)
    # favicon.ico بأحجام 16/32/48
    fav = Image.new("RGBA", (48, 48))
    fav.paste(make_square_icon(48, logo), (0, 0))
    fav.save(
        os.path.join(PUB, "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print("✓ أيقونات الويب + favicon.ico")

    # ===== 3) أيقونات أندرويد (mipmap) =====
    densities = {
        "mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192,
    }
    for dpi, size in densities.items():
        d = os.path.join(RES, f"mipmap-{dpi}")
        os.makedirs(d, exist_ok=True)
        make_square_icon(size, logo).save(os.path.join(d, "ic_launcher.png"))
    # الطبقة الأمامية للأيقونة التكيفية: شفافة، الشعار داخل منطقة الأمان (~58%)
    fg_size = 432  # 108dp عند xxxhdpi
    fg = Image.new("RGBA", (fg_size, fg_size), (0, 0, 0, 0))
    target = int(fg_size * 0.58)
    lw, lh = logo.size
    if lw / lh >= 1:
        nw, nh = target, int(target * lh / lw)
    else:
        nw, nh = int(target * lw / lh), target
    mark = logo.resize((nw, nh), Image.LANCZOS)
    fg.alpha_composite(mark, ((fg_size - nw) // 2, (fg_size - nh) // 2))
    fg.save(os.path.join(RES, "mipmap-xxxhdpi", "ic_launcher_foreground.png"))
    # شعار شاشة البداية (نسخة مرتفعة الظلال — الخلفية كحلية داكنة)
    sp = logo_dark.copy()
    sp.thumbnail((640, 640), Image.LANCZOS)
    sp.save(os.path.join(RES, "drawable-nodpi", "ic_splash_logo.png"))
    print("✓ أيقونات أندرويد + شاشة البداية")

    # ===== 4) معاينة للتدقيق اليدوي =====
    prev = Image.new("RGB", (900, 420), (255, 255, 255))
    prev.paste(logo.resize((360, int(360 * lh / lw))), (30, 30))
    prev.paste(logo_dark.resize((360, int(360 * lh / lw))), (30, 30 + int(360 * lh / lw) + 20))
    dark_side = Image.new("RGB", (450, 420), (10, 17, 40))
    dark_side.paste(logo.resize((180, int(180 * lh / lw))), (20, 20))
    dark_side.paste(logo_dark.resize((180, int(180 * lh / lw))), (240, 20))
    icon_prev = make_square_icon(160, logo)
    dark_side.paste(icon_prev, (150, 230), icon_prev)
    prev.save("/tmp/logo_variants_light.jpg", quality=88)
    dark_side.save("/tmp/logo_variants_dark.jpg", quality=88)
    print("✓ معاينات /tmp/logo_variants_*.jpg")


if __name__ == "__main__":
    main()
