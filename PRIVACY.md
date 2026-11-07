# Privacy Policy — Agent Boundary Watch

**Effective:** November 7, 2026  
**Applies to:** Agent Boundary Watch open-source Chrome extension v0.1 and v0.2.

Agent Boundary Watch performs a permission review **locally in your browser** when you explicitly click **Scan browser** and grant the optional Chrome `management` permission.

## Information accessed

The Chrome Extensions Management API supplies installed extension metadata (names, identifiers, versions, descriptions, enabled state, declared API permissions, host patterns, installation type). Host patterns can expose website names an extension declares it can access. The app uses that metadata to display local risk explanations.

## Information not accessed or collected

The extension does not read website content, cookies, password fields, authentication tokens, browser history, browser traffic, open tab content, or web login sessions. It does not perform network requests, create accounts, use analytics, show ads, or transmit data to us or third parties. No information is sold or shared with third parties by the extension.

## Storage, export and retention

Scan results are kept in the popup's temporary memory while the popup is open, not sent to a server or persisted to Chrome storage. If you click **Export JSON**, the browser saves a local report containing the extension metadata and findings. You control that file. Check extension names, IDs, and host patterns before sending a report to anyone. We do not receive the report.

## Permissions

`management` is optional and requested only after the user clicks Scan. It enables inspection of installed extensions and their declared permissions. If declined, no scan runs. You can revoke permission or uninstall the extension using Chrome's extension settings.

## Changes

If we later introduce optional cloud features or subscription services, they will require a separate privacy review and clear opt-in disclosures. The open-source v0.1 does not include them.

## Questions

Open a GitHub issue in this repository for non-sensitive questions. Do **not** post secrets or private reports publicly. For potential security vulnerabilities, use the private reporting guidance in [SECURITY.md](SECURITY.md).
