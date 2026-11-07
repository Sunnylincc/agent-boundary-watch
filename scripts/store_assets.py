#!/usr/bin/env python3
"""Create Chrome Web Store assets locally. NEVER included in the extension ZIP.

Requires Python 3.10+ and Pillow (developer/CI only). Uses invented sample
extension metadata for a clearly labelled demo screenshot. Never reads a
user's browser profile or confidential extension list.
"""
from pathlib import Path
import shutil

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist" / "store-assets"


def font(size: int, bold: bool = False):
    family = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    candidates = [
        Path("/usr/share/fonts/truetype/dejavu") / family,
        Path("/usr/share/fonts/truetype/liberation2") / (
            "LiberationSans-Bold.ttf" if bold else "LiberationSans-Regular.ttf"
        ),
    ]
    for candidate in candidates:
        if candidate.is_file():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def promo():
    w, h = 440, 280
    img = Image.new("RGB", (w, h), (19, 42, 60))
    pixels = img.load()
    for y in range(h):
        for x in range(w):
            blend = x / w * 0.35 + y / h * 0.4
            pixels[x, y] = (
                round(17 + 17 * blend),
                round(41 + 26 * blend),
                round(58 + 31 * blend),
            )
    draw = ImageDraw.Draw(img)
    draw.ellipse((248, -135, 580, 197), outline=(43, 89, 109), width=2)
    draw.ellipse((309, -74, 532, 144), outline=(40, 81, 103), width=2)
    draw.ellipse((267, 171, 514, 418), outline=(45, 92, 109), width=2)
    draw.rounded_rectangle((28, 26, 102, 100), radius=20, fill=(32, 82, 105))
    shield = [(65, 37), (84, 45), (83, 64), (77, 77), (65, 84), (53, 77), (47, 64), (46, 45), (65, 37)]
    draw.line(shield, fill=(222, 246, 253), width=4, joint="curve")
    draw.line([(56, 60), (63, 67), (75, 52)], fill=(95, 234, 190), width=4, joint="curve")
    draw.text((119, 39), "AGENT BOUNDARY", font=font(17, True), fill=(247, 252, 255))
    draw.text((119, 62), "WATCH", font=font(17, True), fill=(247, 252, 255))
    draw.rounded_rectangle((28, 129, 320, 171), radius=8, fill=(24, 57, 79))
    draw.text((41, 141), "Browser permission audit", font=font(15), fill=(220, 238, 246))
    draw.rounded_rectangle((28, 196, 159, 229), radius=16, fill=(39, 103, 96))
    draw.text((42, 206), "LOCAL ONLY", font=font(11, True), fill=(227, 255, 246))
    draw.rounded_rectangle((168, 196, 308, 229), radius=16, fill=(37, 76, 100))
    draw.text((181, 206), "OPEN SOURCE", font=font(11, True), fill=(219, 240, 251))
    draw.text((30, 253), "Review access. Keep control.", font=font(12), fill=(171, 207, 225))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    img.save(OUTPUT / "promo-440x280.png", optimize=True)


def icon():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    src = ROOT / "icons" / "icon-128.png"
    with Image.open(src) as img:
        if img.size != (128, 128):
            raise ValueError("Extension icon must be 128x128")
    shutil.copyfile(src, OUTPUT / "store-icon-128.png")


def main():
    promo()
    icon()
    print("Created promo-440x280.png and store-icon-128.png")


if __name__ == "__main__":
    main()
