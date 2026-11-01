#!/usr/bin/env python3
"""
مولد صورة المشاركة (OG) + رمز QR لصفحة التطبيق — منصة مامب
التنفيذ: python3 scripts/generate-og-qr.py
"""
import os
from PIL import Image, ImageDraw, ImageFont, features

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
FONTS = os.path.expanduser("~/.fonts")

# ألوان الهوية الرسمية
GREEN = (13, 107, 79)      # 0d6b4f
GREEN_DARK = (8, 61, 46)   # أغمق للتدرج
GOLD = (201, 162, 39)      # c9a227
CREAM = (250, 249, 245)    # faf9f5
WHITE = (255, 255, 255)

AR_BOLD = os.path.join(FONTS, "NotoSansArabic-Bold.ttf")
AR_REG = os.path.join(FONTS, "NotoSansArabic-Regular.ttf")
LAT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
LAT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

assert os.path.exists(AR_BOLD), f"الخط العربي غير موجود: {AR_BOLD}"
HAS_RAQM = features.check("raqm")
print(f"raqm متاح: {HAS_RAQM} — تشكيل عربي سليم مضمون")


def ar_text(draw, xy, text, font, fill, anchor="mm"):
    """رسم نص عربي مع تشكيل سليم (raqm أو reshaper كاحتياط)"""
    if HAS_RAQM:
        draw.text(xy, text, font=font, fill=fill, anchor=anchor,
                  direction="rtl", language="ar")
    else:
        import arabic_reshaper
        from bidi.algorithm import get_display
        shaped = get_display(arabic_reshaper.reshape(text))
        draw.text(xy, shaped, font=font, fill=fill, anchor=anchor)


def vertical_gradient(size, top, bottom):
    """خلفية بتدرج عمودي"""
    w, h = size
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        base.putpixel((0, y), tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
    return base.resize((w, h))


def zellige_band(draw, cx, cy, r, color, width=2):
    """معين زخرفي (عنصر الزليج)"""
    pts = [(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)]
    draw.polygon(pts, outline=color, width=width)


def generate_og():
    W, H = 1200, 630
    img = vertical_gradient((W, H), GREEN_DARK, GREEN).convert("RGBA")
    draw = ImageDraw.Draw(img)

    # زخرفة زليج خفيفة في الزوايا
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    gold_soft = GOLD + (70,)
    for i in range(3):
        zellige_band(odraw, 70, 70, 46 + i * 44, gold_soft)
        zellige_band(odraw, W - 70, H - 70, 46 + i * 44, gold_soft)
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # العلامة البيضاء (من الشعار)
    mark_path = os.path.join(PUBLIC, "icon-512.png")
    # نستخرج العلامة من أيقونة التطبيق (قص المركز بعد إزالة الخلفية عبر mark svg المولد)
    mark_file = os.path.join(ROOT, "app-android/app/src/main/res/drawable-nodpi/ic_splash_logo.png")
    if os.path.exists(mark_file):
        mark = Image.open(mark_file).convert("RGBA").resize((150, 150), Image.LANCZOS)
        img.paste(mark, (W // 2 - 75, 78), mark)

    # الخطوط
    f_title = ImageFont.truetype(AR_BOLD, 104)
    f_sub = ImageFont.truetype(AR_REG, 44)
    f_lat = ImageFont.truetype(LAT_BOLD, 40)
    f_small = ImageFont.truetype(AR_REG, 30)

    cy = 300
    ar_text(draw, (W // 2, cy), "منصة مامب", f_title, WHITE)

    ar_text(draw, (W // 2, cy + 105),
            "رقمنة إدارة ومحاسبة الجمعيات المغربية", f_sub, CREAM)

    # خط ذهبي فاصل مع معينين
    y = cy + 175
    draw.line([(W // 2 - 260, y), (W // 2 + 260, y)], fill=GOLD, width=3)
    zellige_band(draw, W // 2 - 285, y, 9, GOLD, 3)
    zellige_band(draw, W // 2 + 285, y, 9, GOLD, 3)

    draw.text((W // 2, y + 60), "MAMP · mamp.pages.dev",
              font=f_lat, fill=WHITE, anchor="mm")

    ar_text(draw, (W // 2, H - 52),
            "امتثال قانوني 75.00 · حماية المعطيات 09.08 · مساعد جمعوي موثق",
            f_small, (255, 255, 255, 200))

    out = os.path.join(PUBLIC, "og-image.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"  ✓ {out} ({W}x{H})")


def generate_qr():
    import qrcode
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=14,
        border=3,
    )
    qr.add_data("https://mamp.pages.dev/app/")
    qr.make(fit=True)
    img = qr.make_image(fill_color=(11, 20, 16), back_color=(255, 255, 255))
    out = os.path.join(PUBLIC, "qr-app.png")
    img.save(out)
    print(f"  ✓ {out} ({img.size[0]}x{img.size[1]}) — يوجه إلى صفحة التطبيق")


if __name__ == "__main__":
    os.makedirs(PUBLIC, exist_ok=True)
    print("==> [1] صورة المشاركة OG")
    generate_og()
    print("==> [2] رمز QR لصفحة التطبيق")
    generate_qr()
    print("==> ✅ اكتمل")
