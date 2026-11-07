# Phase 2 submission runbook

**Status: prepared, pending Chrome Web Store developer account review and owner-controlled submission.** This document does not imply the extension is live on the Store.

## Prepared independent work

- A release ZIP that contains only runtime assets, with Manifest V3, locally audited code, and only optional `management` permission.
- Open-source repo + MIT license, security / privacy policies and changelog.
- Store listing copy, privacy answers and permission rationale: [STORE_LISTING.md](STORE_LISTING.md).
- Promo tile, store icon, and genuine popup first-run / synthetic-demo UI screenshots generated in CI and attached to the GitHub release.
- Automated Node tests and ZIP inspection via GitHub Actions.

## Owner's next actions once Google account review is approved

1. Open https://chrome.google.com/webstore/devconsole in your registered developer account. Do not create a second account. If Google still shows verification pending, no upload is possible yet.
2. Click **New Item / Add new item** and upload the release asset `agent-boundary-watch-0.2.0.zip` from the official GitHub release. **Do not upload source code or the marketing-asset ZIP as the extension package.**
3. Under **Store Listing**, use the accurate name/description from [STORE_LISTING.md](STORE_LISTING.md), choose an appropriate developer-tools category, and upload the release's 128px icon, 440x280 promotional tile and screenshot(s). Make sure a real screenshot is not confused with labelled demo data.
4. Under **Privacy Practices**, explain the optional `management` permission as local, user-triggered extension inventory/permission analysis. Confirm the privacy disclosures match the source and policy. Use the public privacy-policy URL and support GitHub Issues link.
5. Under **Distribution**, choose **Public / Free** (subject to current dashboard options) and intended countries. Inspect any form fields or legal identity disclosure before final confirmation.
6. Choose **Submit for review** once dashboard validations pass. Approval and any final **Publish** action are separate milestones; do not claim a live listing before Google shows the public URL. To control the go-live date, use deferred publication if offered.
7. After Store approval, install the publicly listed build, confirm the on-demand permission grant, scan, exports and version, and add the verified store link to README.

## Blockers / permissions

The official developer dashboard requires the owner's authenticated Google session and developer-verification approval. The GitHub connection cannot log into, fill in or submit that dashboard. Do not share an authentication cookie, password or API secret. Use a user-authorized browser workflow when available or perform the short dashboard upload yourself.

## Sanity checks before submission

- Test acceptance: user confirmed Phase 1 worked; Phase 2 retains the same scanner code.
- Automated CI must pass for v0.2.0.
- ZIP manifest/version/icons validated; all scripts local; privacy and permission policies consistent.
- Review screenshots and artwork for accurate representations; sample scan is clearly marked.
- No Stripe, server, Convex, Vercel or paid features are included.
