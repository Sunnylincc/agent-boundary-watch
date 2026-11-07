# Chrome Web Store listing — Agent Boundary Watch

**Submission candidate:** v0.2.0  
**Status:** assets prepared; NOT YET submitted or published in Chrome Web Store.  
**Language:** English (United States).  
**Suggested category:** Developer Tools (or Productivity, if category names change).  
**Distribution:** Public, free, all supported regions, subject to your legal requirements and approval.

## Name

Agent Boundary Watch

## Short description (for the store field)

Review installed Chrome extension permissions and spot broad website access. Open source, local-only, and read-only.

## Detailed description (paste into store)

**Understand what your Chrome extensions can access.**

Agent Boundary Watch is a free, open-source browser permission auditor. It helps you review the declared capabilities of your installed extensions, including possible AI-agent and browser automation tools.

What you can do:

- Scan installed Chrome extensions only when you choose.
- Flag broad website permissions and sensitive browser API permissions.
- See which extensions appear to be automation or AI-agent tools, based on their public names and descriptions.
- Filter results by high exposure, review-needed and possible AI-tool categories.
- See plain-language explanations and suggestions for reviewing risky permissions.
- Export a local JSON report if you want to keep a snapshot.

**Private by design**

- No account, subscription, analytics or cloud backend.
- No browsing history, cookies, passwords or login-session data accessed.
- No site content inspection or background network monitoring.
- Your scan results stay in the popup unless you choose to export them.
- Open-source MIT-licensed code you can inspect yourself.

**Why does it request extension management access?**

Chrome's optional "management" permission allows Agent Boundary Watch to read installed extension metadata, including declared permissions. It requests this permission only when you press Scan browser. It does not use that permission to disable, uninstall or modify other extensions.

**What it does not claim**

This is a point-in-time review of *declared* extension permissions. It is not a malware detector, agent-session monitor or proof that an extension has misused access. Chrome's effective per-site grants may differ from what an extension declares. A flagged permission is a reason to investigate, not an accusation.

Open-source code, support and releases:
https://github.com/Sunnylincc/agent-boundary-watch

Privacy policy:
https://github.com/Sunnylincc/agent-boundary-watch/blob/main/PRIVACY.md

## Screenshot and promo file selection

- Required promo tile: `promo-440x280.png` (marketing artwork).
- Required screenshot: `first-run-640x400.png` (rendered directly from shipped popup HTML/CSS).
- Optional second screenshot: `demo-results-640x400.png` (real scan UI with **visible synthetic demo data**).
- Store icon: `store-icon-128.png` (copy of the extension's bundled icon).

Screenshots must accurately reflect the version being uploaded. Prefer adding a genuine screenshot of a completed user-initiated scan from the owner's Chrome if available. Remove or redact sensitive extension details before sharing outside the owner's computer. Never portray synthetic results as a real scan.

## Privacy Practices answers (verify against final Chrome form)

- **Single purpose:** On-demand, local review of installed extension metadata and declared permissions.
- **Justification for optional `management` permission:** Needed to enumerate installed extensions and inspect their metadata and declared permission patterns after a direct user click; no mutation APIs used.
- **Remote hosted code:** No.
- **Data sent off device by this extension:** None.
- **Information processed locally:** Installed extension names, IDs, versions, descriptions, enabled status, install types, and declared API/website permission patterns.
- **Authentication / payments / analytics:** None.
- **Persisted user data:** None, except an optional explicitly exported JSON report controlled by the user.
- **Tabs, cookies, browsing history, session content:** Not accessed.
- **Third-party data sales/sharing:** None performed by the extension.

Chrome Web Store disclosure fields and definitions can change. Read the exact form and answer truthfully; do not blindly classify local processing as "no use" of user data if the form defines collection or use more broadly. Keep the public privacy policy and all checkbox selections consistent.

## Support and policy links

- Support: https://github.com/Sunnylincc/agent-boundary-watch/issues
- Privacy: https://github.com/Sunnylincc/agent-boundary-watch/blob/main/PRIVACY.md
- Security disclosures: https://github.com/Sunnylincc/agent-boundary-watch/blob/main/SECURITY.md

## Claim guardrails

Do NOT claim live AI-agent detection, unauthorized session detection, malware scanning, antivirus protection, system-wide scanning, account-scoped protection, browser tracking, or continuous monitoring. Do NOT use competitor logos or fabricate customer reviews.
