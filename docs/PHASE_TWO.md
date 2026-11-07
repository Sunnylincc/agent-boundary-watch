# Phase 2 — Chrome Web Store launch plan

**Status: planned, not submitted.** Phase 1 is a local, user-installed open-source extension. No public Chrome Web Store listing exists yet.

## Release gate

1. Install the Phase 1 ZIP using Chrome's **Load unpacked** on at least Windows and macOS. Check popup layout, optional permission acceptance/denial, 0/large extension lists, export, keyboard navigation and disabled extensions. Resolve any Chrome runtime errors.
2. Check published GitHub Actions tests and release package. Verify ZIP root contains `manifest.json`, valid icons and no development files.
3. Create store assets: clear 128px icon, screenshots that match the real UI, accurate short/long descriptions, support link, public privacy policy URL and a single-purpose explanation of the `management` permission.
4. Register the owner's own Chrome Web Store developer account via https://chrome.google.com/webstore/devconsole and complete any required one-time registration fee, 2-step verification and account verification. **This is the one unavoidable manual owner step for Phase 2.** Do not buy a subscription.
5. Upload the release ZIP; complete Store Listing, Privacy Practices and Distribution fields accurately. Don't claim monitoring or agent-session detection.
6. Submit for Chrome Web Store review. Public listing is available only after Google approves and publishes it. Do not invent a live store URL or imply approval in advance.
7. After publication, verify installation/update, permissions prompt and scan on the published store build. Add the real Chrome Web Store link to README.
8. Monitor public issues and user feedback; prioritize false positives, permission clarity, robustness and privacy.

## Growth and commercialization hypothesis (not Phase 2 implementation)

Keep local scans free and open-source. Consider opt-in Pro/Teams features later (reliable permission change history, organization-wide policy and audited agent-session integration), only after validating user demand, consent and trust boundaries. A standalone extension cannot determine whether a web login session belongs to an agent or verify unauthorized activity without a credible baseline and auditable sources. Avoid adding tracking or hidden browser monitoring.

## No new infrastructure needed for Phase 2

Chrome Store publication does not require Vercel, Convex or Stripe. A support site could be added later, but is not a launch prerequisite.
