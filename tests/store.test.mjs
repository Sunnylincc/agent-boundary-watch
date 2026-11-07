import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('package and manifest share version and a local-only permission model', () => {
  const manifest = JSON.parse(readFileSync('manifest.json','utf8'));
  const pkg = JSON.parse(readFileSync('package.json','utf8'));
  assert.equal(pkg.version,manifest.version);
  assert.equal(manifest.version,'0.2.0');
  assert.deepEqual(manifest.optional_permissions,['management']);
  assert.ok(!manifest.host_permissions);
  assert.ok(!manifest.background);
  assert.ok(!manifest.content_scripts);
});

test('store listing claims do not include unsupported runtime detection', () => {
  const listing = readFileSync('docs/STORE_LISTING.md','utf8');
  assert.match(listing,/point-in-time review/i);
  assert.match(listing,/not a malware detector, agent-session monitor/i);
  assert.match(listing,/synthetic demo data/i);
  assert.match(listing,/management/);
  assert.match(listing,/https:\/\/github\.com\/Sunnylincc\/agent-boundary-watch\/blob\/main\/PRIVACY\.md/);
});

test('store support assets are build-only and not runtime package entries', () => {
  const pack=readFileSync('scripts/package.mjs','utf8');
  assert.ok(!pack.includes("'scripts/store_assets.py'"));
  assert.ok(!pack.includes("'scripts/store_screenshots.py'"));
  assert.ok(!pack.includes("'docs/STORE_LISTING.md'"));
  for (const name of ['scripts/store_assets.py','scripts/store_screenshots.py','docs/STORE_LISTING.md','docs/STORE_SUBMISSION.md']) assert.ok(existsSync(name));
});
