#!/usr/bin/env python3
from pathlib import Path
import re
import requests

OUT = Path(r"d:\S.C.P\FIRMA 1\site")
BASE = "https://agrigo.geekslabthemes.com/"
s = requests.Session()
s.headers["User-Agent"] = "Mozilla/5.0"

keys = [
    "index.html",
    "about.html",
    "assets/css/main.css",
    "assets/js/main.js",
    "assets/js/gsap.js",
    "assets/js/vendor/gsap.min.js",
    "assets/js/vendor/scroll-trigger.min.js",
    "assets/js/vendor/swiper.min.js",
    "assets/js/vendor/smooth-scroll.js",
    "assets/img/bg-img/hero-bg-1.jpg",
]
print("=== local vs live size ===")
for k in keys:
    lp = OUT / k
    r = s.get(BASE + k, timeout=25)
    live = len(r.content) if r.status_code == 200 else -1
    local = lp.stat().st_size if lp.exists() else -1
    print(("OK" if local == live else "DIFF"), f"{k}: local={local} live={live}")

miss = set()
for html in OUT.glob("*.html"):
    text = html.read_text(encoding="utf-8", errors="replace")
    for m in re.finditer(
        r"""(?:src|href|data-background|data-bg|data-src|poster)=['\"]([^'\"]+)['\"]""",
        text,
    ):
        u = m.group(1).split("?")[0].split("#")[0]
        if not u or u.startswith(
            ("http", "//", "mailto:", "tel:", "javascript:", "data:", "#")
        ):
            continue
        if not (OUT / u.lstrip("./")).exists():
            miss.add(u)

print("missing html asset refs:", len(miss))
for m in sorted(miss):
    print(" ", m)

pages = sorted(p.name for p in OUT.glob("*.html"))
print("pages:", len(pages), pages)
print("files:", sum(1 for _ in OUT.rglob("*") if _.is_file()))
