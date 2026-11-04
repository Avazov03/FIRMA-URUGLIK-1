#!/usr/bin/env python3
"""Mirror Agrigo demo: HTML pages + local assets."""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

import requests
from bs4 import BeautifulSoup

BASE = "https://agrigo.geekslabthemes.com/"
OUT = Path(__file__).resolve().parent / "site"
SESSION = requests.Session()
SESSION.headers.update(
    {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
)

# Known template pages (from theme nav)
SEED_PAGES = [
    "",
    "index.html",
    "index-2.html",
    "index-3.html",
    "about.html",
    "service.html",
    "service-details.html",
    "team.html",
    "team-details.html",
    "testimonial.html",
    "faq.html",
    "pricing.html",
    "error.html",
    "portfolio.html",
    "portfolio-1.html",
    "portfolio-2.html",
    "portfolio-3.html",
    "portfolio-details.html",
    "shop.html",
    "shop-details.html",
    "cart.html",
    "checkout.html",
    "blog-grid.html",
    "blog-standard.html",
    "blog-details.html",
    "contact.html",
]

ATTR_URLS = [
    ("link", "href"),
    ("script", "src"),
    ("img", "src"),
    ("img", "data-src"),
    ("source", "src"),
    ("source", "srcset"),
    ("video", "poster"),
    ("video", "src"),
    ("audio", "src"),
    ("use", "href"),
    ("image", "href"),
    ("a", "href"),
]

CSS_URL_RE = re.compile(r"url\(\s*['\"]?([^)'\"]+)['\"]?\s*\)", re.I)
SRCSET_RE = re.compile(r"([^\s,]+)(?:\s+[\d.]+[wx])?", re.I)


def same_site(url: str) -> bool:
    p = urlparse(url)
    return p.netloc in ("", "agrigo.geekslabthemes.com")


def to_local_path(url: str) -> Path | None:
    p = urlparse(url)
    if p.netloc and p.netloc != "agrigo.geekslabthemes.com":
        return None
    path = unquote(p.path or "/")
    if path.endswith("/"):
        path += "index.html"
    if path == "" or path == "/":
        path = "/index.html"
    # strip leading /
    rel = path.lstrip("/")
    if not rel:
        rel = "index.html"
    return OUT / rel


def fetch(url: str) -> bytes | None:
    try:
        r = SESSION.get(url, timeout=40)
        if r.status_code != 200:
            print(f"  FAIL {r.status_code} {url}")
            return None
        return r.content
    except Exception as e:
        print(f"  ERR {url}: {e}")
        return None


def save(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def extract_urls(html: str, page_url: str) -> set[str]:
    found: set[str] = set()
    soup = BeautifulSoup(html, "lxml")

    for tag, attr in ATTR_URLS:
        for el in soup.find_all(tag):
            val = el.get(attr)
            if not val:
                continue
            if attr == "srcset":
                for m in SRCSET_RE.finditer(val):
                    found.add(urljoin(page_url, m.group(1)))
            else:
                found.add(urljoin(page_url, val.split()[0]))

    # inline style url()
    for el in soup.find_all(style=True):
        for m in CSS_URL_RE.finditer(el["style"]):
            found.add(urljoin(page_url, m.group(1)))

    # style tags
    for style in soup.find_all("style"):
        if style.string:
            for m in CSS_URL_RE.finditer(style.string):
                found.add(urljoin(page_url, m.group(1)))

    return found


def extract_css_urls(css_text: str, css_url: str) -> set[str]:
    found: set[str] = set()
    for m in CSS_URL_RE.finditer(css_text):
        u = m.group(1).strip()
        if u.startswith("data:"):
            continue
        found.add(urljoin(css_url, u))
    # @import
    for m in re.finditer(r"@import\s+(?:url\()?['\"]?([^)'\";]+)", css_text, re.I):
        found.add(urljoin(css_url, m.group(1).strip()))
    return found


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    queued: list[str] = []
    seen: set[str] = set()
    asset_queue: list[str] = []
    asset_seen: set[str] = set()

    for p in SEED_PAGES:
        queued.append(urljoin(BASE, p))

    print(f"Downloading pages into {OUT}")
    while queued:
        url = queued.pop(0)
        # normalize
        if url.endswith("/"):
            url = urljoin(url, "index.html") if url != BASE else urljoin(BASE, "index.html")
        if url in seen:
            continue
        if not same_site(url):
            continue
        # only html pages in page queue
        path = urlparse(url).path.lower()
        if path and not (
            path.endswith(".html")
            or path.endswith("/")
            or path == ""
            or "." not in Path(path).name
        ):
            # treat as asset
            if url not in asset_seen:
                asset_queue.append(url)
                asset_seen.add(url)
            continue

        seen.add(url)
        print(f"PAGE {url}")
        data = fetch(url)
        if data is None:
            continue
        local = to_local_path(url)
        if local is None:
            continue
        # If root without filename
        if local.suffix == "":
            local = local / "index.html"
        save(local, data)

        try:
            html = data.decode("utf-8", errors="replace")
        except Exception:
            continue

        for u in extract_urls(html, url):
            if not same_site(u):
                continue
            pu = urlparse(u)
            # skip anchors-only / mailto / tel
            if u.startswith("mailto:") or u.startswith("tel:") or u.startswith("javascript:"):
                continue
            ext = Path(unquote(pu.path)).suffix.lower()
            if ext in (".html", "") or pu.path.endswith("/"):
                if u not in seen:
                    queued.append(u.split("#")[0])
            else:
                clean = u.split("#")[0].split("?")[0]
                if clean not in asset_seen:
                    asset_seen.add(clean)
                    asset_queue.append(clean)

        time.sleep(0.05)

    print(f"\nDownloading {len(asset_queue)} assets...")
    css_to_parse: list[tuple[str, Path]] = []

    i = 0
    while i < len(asset_queue):
        url = asset_queue[i]
        i += 1
        if not same_site(url):
            continue
        local = to_local_path(url.split("?")[0])
        if local is None:
            continue
        if local.exists() and local.stat().st_size > 0:
            # still parse CSS if needed
            if local.suffix.lower() == ".css":
                css_to_parse.append((url, local))
            continue
        print(f"ASSET {url}")
        data = fetch(url)
        if data is None:
            continue
        save(local, data)
        if local.suffix.lower() == ".css":
            css_to_parse.append((url, local))
        time.sleep(0.03)

    # parse CSS for fonts/images
    print(f"\nParsing {len(css_to_parse)} CSS files for nested assets...")
    for css_url, css_path in css_to_parse:
        try:
            text = css_path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        for u in extract_css_urls(text, css_url):
            if not same_site(u):
                continue
            clean = u.split("#")[0].split("?")[0]
            if clean.startswith("data:"):
                continue
            local = to_local_path(clean)
            if local is None or (local.exists() and local.stat().st_size > 0):
                continue
            print(f"CSS-ASSET {clean}")
            data = fetch(clean)
            if data:
                save(local, data)
            time.sleep(0.02)

    # Ensure index.html exists at root (demo may only have /)
    root_index = OUT / "index.html"
    if not root_index.exists():
        # try fetch explicitly
        data = fetch(urljoin(BASE, "index.html"))
        if data:
            save(root_index, data)

    files = list(OUT.rglob("*"))
    file_count = sum(1 for f in files if f.is_file())
    print(f"\nDone. {file_count} files in {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
