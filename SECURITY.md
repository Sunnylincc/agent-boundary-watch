# Security policy and threat model

## Reporting vulnerabilities

Please use GitHub's **Report a vulnerability** / private vulnerability reporting feature if it is enabled for this repository. Otherwise, open a minimal public issue without exploit details or secrets requesting a private contact channel. Do not include real browser reports, credentials, extension IDs, host lists or private data in public disclosures.

## Phase 1 trust boundaries

- Runs as a local Manifest V3 extension.
- Requires no `host_permissions`, content scripts, remote code, persistent background service workers, cloud APIs or API keys.
- Requests only the optional `management` permission in response to a direct user click.
- Does not call management mutation functions; the only Chrome management operation is `getAll()`.
- Renders metadata as text nodes, not HTML markup.
- Keeps results in memory. A report is exported only on explicit user request.
- Does not read browsing sessions or claim to find actual unauthorized agent activity.

## What a finding means

Flags are indicators of **declared capability exposure**, not definitive conclusions about whether access is granted or exercised, a tool is malicious, or a session is compromised. A disabled extension has no active severity in the report, though its declared capabilities may still be shown.

## Out of scope

No desktop process or MCP scanner, browser traffic analyzer, runtime sandbox, malware engine, authorization enforcement or session inspection is included in Phase 1.

## Supply chain and development

Source is dependency-free; production code is checked into the repository. GitHub Actions packages the reviewed files into the ZIP without downloading runtime libraries. Review changes to permissions carefully. Avoid extending permissions or adding network connections without explicit review and a privacy policy update.
