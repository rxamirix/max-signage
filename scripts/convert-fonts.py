"""Convert the KookFaNum TTF family to woff2 inside public/fonts."""

import os
import shutil
import sys

from fontTools.ttLib import TTFont

SOURCES = {
    "KookFaNum-ExtraLight.ttf": "KookFaNum-ExtraLight",
    "KookFaNum-Light.ttf": "KookFaNum-Light",
    "KookFaNum-Regular.ttf": "KookFaNum-Regular",
    "KookFaNum-Medium.ttf": "KookFaNum-Medium",
    "KookFaNum-Bold.ttf": "KookFaNum-Bold",
    "KookFaNum-ExtraBold.ttf": "KookFaNum-ExtraBold",
}

SOURCE_DIR = "D:\\"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "fonts")


def main() -> int:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    missing = []

    for filename, output_name in SOURCES.items():
        source = os.path.join(SOURCE_DIR, filename)
        if not os.path.exists(source):
            # "KookFaNum-Bold (1).ttf" is the duplicate the client sent for Bold.
            fallback = os.path.join(SOURCE_DIR, filename.replace(".ttf", " (1).ttf"))
            if os.path.exists(fallback):
                source = fallback
            else:
                missing.append(filename)
                continue

        target = os.path.join(OUTPUT_DIR, output_name + ".woff2")
        font = TTFont(source)
        font.flavor = "woff2"
        font.save(target)
        size_kb = os.path.getsize(target) / 1024
        print(f"{output_name}.woff2 -> {size_kb:.1f} KB")

    if missing:
        print("missing sources: " + ", ".join(missing), file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
