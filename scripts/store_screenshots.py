#!/usr/bin/env python3
"""Capture the REAL shipped popup's HTML/CSS + JS using synthetic demo metadata.

Screenshots are explicitly labelled as demo-data previews. Real permissions
are never harvested from the CI runner. This script is excluded from the ZIP.
Requires Playwright (developer only) and installed Google Chrome / Chromium.
"""
from pathlib import Path
import re
import shutil

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist" / "store-assets"

SAMPLE_EXTENSIONS = [
    {
        "id": "example-ai-agent-0001",
        "name": "Example Browser AI Agent",
        "description": "AI agent for browser automation and web workflows (demo data).",
        "type": "extension",
        "version": "1.0.0",
        "enabled": True,
        "installType": "normal",
        "permissions": ["scripting", "tabs"],
        "hostPermissions": ["<all_urls>"],
    },
    {
        "id": "example-helper-0002",
        "name": "Example Notes Helper",
        "description": "Example note-taking extension (demo data).",
        "type": "extension",
        "version": "1.0.0",
        "enabled": True,
        "installType": "normal",
        "permissions": [],
        "hostPermissions": ["https://example.com/*"],
    },
    {
        "id": "example-automation-0003",
        "name": "Example Browser Automation",
        "description": "Example automation extension (demo data).",
        "type": "extension",
        "version": "1.0.0",
        "enabled": True,
        "installType": "normal",
        "permissions": ["nativeMessaging"],
        "hostPermissions": [],
    },
]


def runtime_bundle():
    pieces = []
    for relative in ("src/risk.mjs", "src/report.mjs", "src/popup.mjs"):
        content = (ROOT / relative).read_text(encoding="utf-8")
        # For local preview only: concatenate the same source modules without
        # changing runtime functions, avoiding forbidden file:// module imports.
        content = re.sub(r"(?m)^import\s+\{[^}]+\}\s+from\s+['\"][^'\"]+['\"];\s*$", "", content)
        content = re.sub(r"(?m)^export\s+", "", content)
        pieces.append(content)
    return "\n".join(pieces)


def run():
    chrome = (
        shutil.which("google-chrome")
        or shutil.which("google-chrome-stable")
        or shutil.which("chromium")
        or shutil.which("chromium-browser")
    )
    if not chrome:
        raise RuntimeError("Google Chrome / Chromium is required for genuine UI screenshots")
    html = (ROOT / "popup.html").read_text(encoding="utf-8")
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>{css}</style>")
    html = re.sub(r'<script\s+type="module"\s+src="src/popup.mjs"></script>', "", html)
    OUTPUT.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=chrome,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        page = browser.new_page(viewport={"width": 640, "height": 400}, device_scale_factor=1)
        page.set_content(html, wait_until="domcontentloaded")
        page.add_style_tag(content="html{width:100%;background:#f5f8fa}body{margin-left:auto;margin-right:auto}")
        assert page.get_by_role("button", name="Scan browser").is_visible()
        page.screenshot(path=str(OUTPUT / "first-run-640x400.png"), animations="disabled")

        page.evaluate(
            """(fixtures) => {
              window.chrome = {
                runtime: { id: 'agent-boundary-watch-demo-self' },
                permissions: { request: async () => true },
                management: { getAll: async () => fixtures }
              };
            }""",
            SAMPLE_EXTENSIONS,
        )
        page.add_script_tag(content=runtime_bundle())
        page.get_by_role("button", name="Scan browser").click()
        page.wait_for_function("document.querySelector('#totalCount').textContent === '3'")
        page.evaluate(
            """() => {
              const status = document.querySelector('#status');
              status.textContent = 'DEMO DATA — synthetic examples, not a real device scan.';
              status.dataset.state = 'warning';
              window.scrollTo(0, 145);
            }"""
        )
        page.screenshot(path=str(OUTPUT / "demo-results-640x400.png"), animations="disabled")
        browser.close()

    with __import__("PIL.Image", fromlist=["Image"]).open(OUTPUT / "first-run-640x400.png") as image:
        assert image.size == (640, 400)
    with __import__("PIL.Image", fromlist=["Image"]).open(OUTPUT / "demo-results-640x400.png") as image:
        assert image.size == (640, 400)
    print("Captured true popup HTML/CSS with clearly labelled synthetic scan data")


if __name__ == "__main__":
    run()
