# Agent Boundary Watch

**Know what has access.** A small, open-source Chrome extension for reviewing the declared permissions of installed browser extensions, including possible AI-agent and automation tools.

[![CI](https://github.com/Sunnylincc/agent-boundary-watch/actions/workflows/ci.yml/badge.svg)](https://github.com/Sunnylincc/agent-boundary-watch/actions/workflows/ci.yml)

> **Scope:** Version 0.1 is a **read-only, point-in-time permission exposure review**. It does **not** detect active AI sessions, see which account an agent is using, verify effective site access, prove permission escalation, detect malware, or enforce authorization. A flag is a reason to review an extension, **not** an accusation of malicious behavior.

## Install and try Phase 1

The open-source v0.2.0 Chrome Web Store submission candidate is ready. Official Store review/publication is **pending developer account approval**. For now, install the open-source build:

1. Download the latest ZIP from [GitHub Releases](https://github.com/Sunnylincc/agent-boundary-watch/releases), or clone the repository.
2. Extract the ZIP to a folder. The extracted folder must contain `manifest.json` directly inside it.
3. Open `chrome://extensions/` in desktop Google Chrome.
4. Enable **Developer mode**, choose **Load unpacked**, and select the extracted folder.
5. Pin **Agent Boundary Watch** in the browser toolbar and click **Scan browser**.
6. Approve the one-time **Manage your apps, extensions, and themes** permission request if you want to scan. Declining scans nothing.

The ZIP is a **developer-mode package**, not a Chrome Web Store installation or a signed CRX. Installing unpacked extensions requires care: download only from the official repository and verify the source.

## What Phase 1 actually does

- Enumerates installed extensions using Chrome's `management.getAll()` API **after** an explicit scan click and permission grant.
- Reads metadata for extensions: name, version, enabled status, declared API permissions, declared host patterns and install type.
- Flags potentially broad website access, sensitive browser APIs and sideloaded installations.
- Marks *possible* agent/automation extensions using conservative terms from names/descriptions. Classification is probabilistic.
- Shows severity labels, evidence and explanations; disabled extensions are not classified as currently exposed.
- Provides filters for all extensions, high exposure, needs review and possible AI tools.
- Can export an optional **local JSON report**. Review it before sharing: it includes extension names, identifiers and host patterns.

### Privacy-first defaults

No account, network calls, analytics, telemetry, cloud upload, remote scripts, cookies, tokens, browsing history, page injection, or background monitoring. `management` is an **optional permission** requested only when you click Scan. The scan result exists in popup memory while it is open. An exported report is saved only if you click Export JSON. See [Privacy](PRIVACY.md) and [Security](SECURITY.md).

### Security model and known limitations

The Chrome Management API reports declared permissions, which may differ from currently granted site-specific access or effective permissions. Some browser permissions require additional consent or constraints. We do **not** interpret all declarations as active rights. Broad permissions are common in legitimate tools, and less-obvious risks can go undetected. Risk flags do not establish misconduct, compromise or real-world privilege escalation.

Only browser extensions are in scope. Desktop agents, MCP processes, applications, browsing sessions and Chrome profiles outside the current Chrome instance are not scanned. A login session cannot reliably be classified as human- or agent-driven using this API.

## Development

**No runtime dependencies, build framework, API keys, or server required.** This is intentional for a small security-oriented extension: the source is what Chrome runs. Requirements for tests and packaging: Node.js 20+.

```sh
npm test
npm run pack
```

The package script creates `dist/agent-boundary-watch-0.1.0.zip`, with the manifest at ZIP root. GitHub Actions runs tests, validates the package and publishes **new versioned** GitHub releases without replacing old release assets.

Source: `src/risk.mjs` (analysis), `src/report.mjs` (local export), `src/popup.mjs` (UI), `popup.html`, `styles.css`. Tests live in `tests/`.

## Roadmap

Phase 2 prepares the Chrome Web Store listing, test assets and a versioned submission package; final submission awaits the owner's developer-account verification and Google review. All components of v0.2 remain free, open-source and local-only. See [Phase 2 status](docs/PHASE_TWO.md), [Store listing](docs/STORE_LISTING.md) and [submission runbook](docs/STORE_SUBMISSION.md). Phase 3 may add opt-in monitoring and paid team features **only** if reliable browser/agent audit sources can be integrated.

Contributions and security reports are welcome. Please avoid including real host permissions, browsing details, API keys or other private data in public issues.

Released under the [MIT License](LICENSE).
\n## Chrome Web Store submission candidate (v0.2.0)\n\nThe [v0.2.0 release](https://github.com/Sunnylincc/agent-boundary-watch/releases/tag/v0.2.0) contains the Store ZIP, a 440×280 promotional tile, the 128px store icon, a real first-run UI screenshot and a **labelled demo-data** results screenshot. The screenshots are made with the shipped popup HTML/CSS/JS and invented metadata only. The release does **not** mean Google has approved or published the extension. The developer account is still under review; see the [owner submission steps](docs/STORE_SUBMISSION.md).\n