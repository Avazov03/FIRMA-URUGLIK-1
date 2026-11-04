#!/usr/bin/env python3
from pathlib import Path
import re
from urllib.parse import urljoin
import requests

OUT = Path(r"d:\S.C.P\FIRMA 1\site")
BASE = "https://agrigo.geekslabthemes.com/"
CSS_URL_RE = re.compile(r"url\(\s*['\"]?([^)'\"]+)['\"]?\s*\)", re.I)

missing = []
checked = set()

for css in OUT.rglob("*.css"):
    text = css.read_text(encoding="utf-8", errors="replace")
    for m in CSS_URL_RE.finditer(text):
        u = m.group(1).strip().strip("'\"")
        if u.startswith("data:") or u.startswith("#") or u.startswith("http"):
            continue
        abs_path = (css.parent / u).resolve()
        try:
            rel = abs_path.relative_to(OUT.resolve())
        except ValueError:
            continue
        key = str(rel).replace("\\", "/")
        if key in checked:
            continue
        checked.add(key)
        if not (OUT / rel).exists():
            missing.append(key)

for html in OUT.glob("*.html"):
    text = html.read_text(encoding="utf-8", errors="replace")
    for m in re.finditer(
        r"""(?:src|href|data-background|data-bg|data-src|poster)=['\"]([^'\"]*assets/[^'\"]+)['\"]""",
        text,
    ):
        u = m.group(1).split("?")[0]
        if u.startswith("http"):
            continue
        key = u.lstrip("./")
        if key in checked:
            continue
        checked.add(key)
        if not (OUT / key).exists():
            missing.append(key)
    for m in re.finditer(r"url\((['\"]?)(assets/[^)'\"]+)\1\)", text):
        key = m.group(2)
        if key not in checked and not (OUT / key).exists():
            missing.append(key)
            checked.add(key)

# Known critical backgrounds often only in CSS
extra = [
    "assets/img/bg-img/hero-bg-1.jpg",
    "assets/img/bg-img/hero-bg-2.jpg",
    "assets/img/bg-img/hero-bg-3.jpg",
    "assets/img/shapes/features-bg-shape.png",
    "assets/img/shapes/testi-bg-shape.png",
    "assets/img/images/video-image.jpg",
    "assets/img/images/cta-image-2.jpg",
    "assets/img/images/cta-image.jpg",
    "assets/webfonts/fa-solid-900.woff2",
    "assets/webfonts/fa-regular-400.woff2",
    "assets/webfonts/fa-brands-400.woff2",
]
for e in extra:
    if not (OUT / e).exists() and e not in checked:
        missing.append(e)

print(f"Missing count: {len(set(missing))}")
for m in sorted(set(missing)):
    print(" ", m)

s = requests.Session()
s.headers["User-Agent"] = "Mozilla/5.0"
ok = fail = 0
for rel in sorted(set(missing)):
    url = urljoin(BASE, rel)
    path = OUT / rel
    try:
        r = s.get(url, timeout=30)
        if r.status_code == 200 and r.content:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(r.content)
            print("OK", rel)
            ok += 1
        else:
            print("FAIL", r.status_code, rel)
            fail += 1
    except Exception as e:
        print("ERR", rel, e)
        fail += 1
print(f"Downloaded {ok}, failed {fail}")
