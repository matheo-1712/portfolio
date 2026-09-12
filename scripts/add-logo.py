#!/usr/bin/env python3
"""Prepare un logo de projet pour le portfolio.

Recadre l'image au carre, la redimensionne et l'ecrit en WebP dans
static/img/projects/<slug>.webp — la ou le build la cherche.

    python scripts/add-logo.py mon-logo.png cobblemon-trainers

Le slug est celui du projet dans data/projects.json. Sans argument de slug,
le nom du fichier source est utilise.

Depose sinon l'image telle quelle dans static/img/projects/ : le build accepte
aussi png, svg, jpg et jpeg. Ce script ne sert qu'a reduire le poids.
"""

import sys
import pathlib
import re
import unicodedata

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow est requis : pip install Pillow")

SIZE = 96
ROOT = pathlib.Path(__file__).resolve().parent.parent
DEST = ROOT / "static" / "img" / "projects"


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFD", value)
    value = "".join(c for c in value if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)

    source = pathlib.Path(sys.argv[1])
    if not source.exists():
        sys.exit(f"Fichier introuvable : {source}")

    slug = slugify(sys.argv[2] if len(sys.argv) > 2 else source.stem)

    im = Image.open(source).convert("RGBA")

    # Un logo deja carre est simplement redimensionne. Une image large est
    # recadree en son centre plutot que deformee.
    if abs(im.width - im.height) > 1:
        side = min(im.width, im.height)
        left = (im.width - side) // 2
        top = (im.height - side) // 2
        im = im.crop((left, top, left + side, top + side))

    im = im.resize((SIZE, SIZE), Image.LANCZOS)

    DEST.mkdir(parents=True, exist_ok=True)
    out = DEST / f"{slug}.webp"
    im.save(out, "WEBP", quality=88, method=6)

    before = source.stat().st_size
    after = out.stat().st_size
    print(f"{out.relative_to(ROOT)}  {after} octets  (source : {before})")
    print("Relance `npm run build` pour le voir apparaitre.")


if __name__ == "__main__":
    main()
