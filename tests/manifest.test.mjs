import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);

test('manifest uses only optional management permission, no site access', () => {
  const m = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'));
  assert.equal(m.manifest_version, 3);
  assert.deepEqual(m.optional_permissions, ['management']);
  assert.ok(!m.permissions || m.permissions.length === 0);
  assert.ok(!m.host_permissions || m.host_permissions.length === 0);
  assert.ok(!m.content_scripts);
  assert.ok(!m.background);
  assert.equal(m.action.default_popup, 'popup.html');
});

test('popup has no remote scripts or remote stylesheets', () => {
  const html = readFileSync(new URL('popup.html', root), 'utf8');
  assert.match(html, /src="src\/popup\.mjs"/);
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /<script(?![^>]*src=)/);
});

test('browser UI escapes untrusted extension names with textContent', () => {
  const js = readFileSync(new URL('src/popup.mjs', root), 'utf8');
  assert.match(js, /node\.textContent = text/);
  assert.doesNotMatch(js, /innerHTML|outerHTML|insertAdjacentHTML/);
});

test('extension runtime does not use fetch, XMLHttpRequest or remote script imports', () => {
  for (const path of ['src/popup.mjs', 'src/risk.mjs', 'src/report.mjs']) {
    const js = readFileSync(new URL(path, root), 'utf8');
    assert.doesNotMatch(js, /\bfetch\s*\(|\bXMLHttpRequest\b|https?:\/\//);
  }
});
