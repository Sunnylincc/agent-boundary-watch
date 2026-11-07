import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeExtensions } from '../src/risk.mjs';
import { createReport, serializeReport } from '../src/report.mjs';

test('local report exports declared metadata but not browser session data or descriptions', () => {
  const raw = [{
    id: 'extension123', name: 'Sample', description: 'Secret description not in exported report',
    enabled: true, type: 'extension', version: '1', installType: 'normal',
    permissions: ['cookies'], hostPermissions: ['https://example.com/*'],
    homepageUrl: 'https://private.example.com/secret', optionsUrl: 'https://private.example.com/config'
  }];
  const data = analyzeExtensions(raw, '', '2026-11-07T00:00:00Z');
  const report = createReport(data);
  const json = serializeReport(data);
  assert.equal(report.summary.total, 1);
  assert.equal(report.extensions[0].id, 'extension123');
  assert.equal(report.extensions[0].hostPermissions[0], 'https://example.com/*');
  assert.ok(json.endsWith('\n'));
  assert.ok(!json.includes('Secret description'));
  assert.ok(!json.includes('private.example.com'));
  assert.ok(!json.includes('sessionToken'));
  assert.deepEqual(JSON.parse(json), report);
});
