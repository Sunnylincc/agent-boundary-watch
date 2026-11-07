import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeExtension, analyzeExtensions, classifyHostPattern, isAgentCandidate } from '../src/risk.mjs';

function extension(overrides = {}) {
  return {
    id: 'sample-id',
    name: 'Sample browser tool',
    description: '',
    type: 'extension',
    version: '1.2.3',
    enabled: true,
    permissions: [],
    hostPermissions: [],
    installType: 'normal',
    ...overrides
  };
}

test('exact all-sites patterns produce high exposure', () => {
  for (const host of ['<all_urls>', '*://*/*', 'https://*/*', 'http://*/*']) {
    const result = analyzeExtension(extension({ hostPermissions: [host] }));
    assert.equal(result.severity, 'high');
    assert.equal(result.findings[0].id, 'broad-host-access');
  }
});

test('single scoped host does not trigger high exposure', () => {
  const result = analyzeExtension(extension({ hostPermissions: ['https://example.com/*'] }));
  assert.equal(result.severity, 'none');
  assert.equal(result.hostPermissions[0], 'https://example.com/*');
});

test('specific wildcard subdomain is not classified as all-sites', () => {
  assert.equal(classifyHostPattern('https://*.example.com/*'), 'scoped');
});

test('sensitive debugging and proxy permissions are high', () => {
  for (const permission of ['debugger', 'proxy']) {
    assert.equal(analyzeExtension(extension({ permissions: [permission] })).severity, 'high');
  }
});

test('cookies and nativeMessaging trigger review, not proof of compromise', () => {
  const result = analyzeExtension(extension({ permissions: ['cookies', 'nativeMessaging'] }));
  assert.equal(result.severity, 'review');
  assert.equal(result.findings.length, 2);
});

test('disabled extension is not flagged as actively exposed', () => {
  const result = analyzeExtension(extension({ enabled: false, permissions: ['debugger'] }));
  assert.equal(result.severity, 'none');
  assert.equal(result.inactiveExposure, true);
  assert.equal(result.findings[0].severity, 'high');
});

test('agent classification is conservative and descriptive only', () => {
  assert.equal(isAgentCandidate(extension({ name: 'AI Browser Agent' })), true);
  assert.equal(isAgentCandidate(extension({ description: 'Automate browser workflows for testing.' })), true);
  assert.equal(isAgentCandidate(extension({ name: 'Simple AI Notes' })), false);
  assert.equal(isAgentCandidate(extension({ name: 'User Agent Switcher' })), false);
});

test('sideloaded extension is a review flag, not automatic high', () => {
  const result = analyzeExtension(extension({ installType: 'sideload' }));
  assert.equal(result.severity, 'review');
});

test('all extensions are counted correctly, themes and self excluded', () => {
  const result = analyzeExtensions([
    extension({ id: 'self-id' }),
    extension({ id: 'x1', permissions: ['debugger'] }),
    extension({ id: 'x2', enabled: false, hostPermissions: ['<all_urls>'] }),
    extension({ id: 'x3', name: 'Browser Agent' }),
    extension({ id: 'theme', type: 'theme' })
  ], 'self-id', '2026-11-07T00:00:00Z');
  assert.deepEqual(result.summary, { total: 3, enabled: 2, high: 1, review: 0, agentCandidates: 1 });
  assert.equal(result.extensions[0].id, 'x1');
});

test('malformed metadata and duplicate permissions cannot crash analysis', () => {
  const result = analyzeExtension(extension({
    name: '<img src=x onerror=alert(1)>',
    permissions: ['cookies', 'cookies', 123, null],
    hostPermissions: [null, 'https://example.com/*', 'https://example.com/*']
  }));
  assert.deepEqual(result.apiPermissions, ['cookies']);
  assert.equal(result.hostPermissions.length, 1);
  assert.equal(result.name, '<img src=x onerror=alert(1)>');
});

test('many site patterns are review-worthy without all-host claim', () => {
  const hosts = Array.from({ length: 8 }, (_, i) => 'https://example' + i + '.com/*');
  const result = analyzeExtension(extension({ hostPermissions: hosts }));
  assert.equal(result.severity, 'review');
  assert.ok(result.findings.some((f) => f.id === 'many-hosts'));
});

test('no broad runtime or session assertions in model', () => {
  const result = analyzeExtensions([extension()], '', '2026-11-07T00:00:00Z');
  assert.equal(Object.hasOwn(result, 'sessions'), false);
  assert.equal(Object.hasOwn(result.extensions[0], 'isCompromised'), false);
});
