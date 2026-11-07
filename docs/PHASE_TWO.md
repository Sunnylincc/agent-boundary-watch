# Phase 2 — Chrome Web Store submission

**Status: v0.2.0 submission candidate prepared; developer account review and Store submission pending.** There is no public Chrome Web Store listing or claimed approval yet.

## Done or prepared

- Chrome Store ZIP packaging and automated checks (without changing the working Phase 1 scanner).
- English store metadata, privacy disclosures, optional `management` permission explanation.
- 128px store icon, 440x280 promotional tile, real first-run UI screenshot, and clearly labelled example-data results screenshot.
- Release workflow and explicit owner submission runbook.

See [Store listing](STORE_LISTING.md) and [submission runbook](STORE_SUBMISSION.md).

## Submission / approval remaining

The developer account owner must finish the Chrome Web Store developer-account verification and use the authenticated dashboard to upload the package and complete the official privacy/distribution forms. Once the extension is reviewed and published, verify the real Store URL before updating README. Google controls timing and approval outcome.

## Roadmap after launch (not in Phase 2)

Keep the existing local scanner open-source under MIT. Pro / Teams might later add permission-change history, auditable sources for agent-session events and team policies behind a separate paid service, only after demand is validated. A browser extension cannot independently prove that an AI agent acted through a given session.

No new backend, payment, analytics, tracking or cloud services have been added.
