/**
 * Explainable, static extension-permission exposure assessment.
 * Only analyzes chrome.management.ExtensionInfo metadata supplied by Chrome.
 * No identity inference, traffic inspection, session inspection, or enforcement.
 */
export const SEVERITY = Object.freeze({ high: 3, review: 2, low: 1, none: 0 });

const PERMISSION_RULES = Object.freeze({
  debugger: ['high', 'Browser debugging access', 'Can attach to browser debugging interfaces and potentially inspect page activity.', 'Keep enabled only if needed; review the developer and purpose.'],
  proxy: ['high', 'Proxy configuration access', 'Can change browser proxy settings, potentially affecting where traffic flows.', 'Verify that controlling network routing is essential.'],
  nativeMessaging: ['review', 'Native messaging access', 'May communicate with an installed application outside the browser.', 'Review the extension and any companion desktop application.'],
  cookies: ['review', 'Cookie API access', 'Can request cookie data for hosts the extension is permitted to access.', 'Check whether cookie access is necessary for its purpose.'],
  history: ['review', 'Browsing history access', 'Can inspect browsing history through a privileged browser API.', 'Consider whether this feature requires your browsing history.'],
  management: ['review', 'Extension management access', 'Can list installed extensions and may have management capabilities.', 'Confirm extension management is part of its stated function.'],
  webRequest: ['review', 'Web request observation', 'Can observe permitted network requests according to browser API rules.', 'Review the scope of the sites it can access.'],
  webRequestBlocking: ['review', 'Web request blocking capability', 'A declared network interception permission; actual availability depends on browser policy.', 'Confirm that request interception is expected.'],
  tabs: ['review', 'Tab metadata access', 'Can access certain tab details under its permissions.', 'Check if tab awareness is needed for this extension.'],
  downloads: ['review', 'Download management access', 'Can interact with downloads through the browser API.', 'Check whether download access is expected.'],
  clipboardRead: ['review', 'Clipboard read access', 'Can read clipboard content when permitted by browser restrictions.', 'Consider whether the extension needs your clipboard.'],
  desktopCapture: ['review', 'Screen capture capability', 'Can request desktop or screen capture with browser-mediated user consent.', 'Check why screen capture is needed.'],
  tabCapture: ['review', 'Tab capture capability', 'Can capture tab media within browser restrictions.', 'Check why tab capture is needed.'],
  scripting: ['review', 'Script injection capability', 'Can inject scripts into pages for which the extension has suitable access.', 'Review its website access scope.']
});

const AGENT_TERMS = [
  /\bai[ -]agent(s)?\b/i,
  /\bbrowser[ -]agent(s)?\b/i,
  /\bagentic\b/i,
  /\bautonomous (browser|agent|assistant|automation)\b/i,
  /\b(automate|automation|automating) (the )?(browser|web|tasks|workflows)\b/i,
  /\bcomputer[ -]use (agent|assistant|automation)\b/i,
  /\bweb[ -]automation\b/i,
  /\bworkflow[ -]agent\b/i
];

const safeText = (value, max = 180) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const unique = (items) => [...new Set(Array.isArray(items) ? items.filter((x) => typeof x === 'string') : [])].sort();

export function isAgentCandidate(info) {
  const description = safeText(info?.description, 300);
  const name = safeText(info?.name, 120);
  return AGENT_TERMS.some((pattern) => pattern.test(name) || pattern.test(description));
}

/**
 * Chrome ignores the path component of manifest host permissions.
 * Classify effective web host coverage from scheme + hostname, not the path.
 * Invalid/unsupported shapes are not silently promoted to broad exposure.
 * File access is a distinct capability, not access to all web hosts.
 */
export function classifyHostPattern(pattern) {
  if (typeof pattern !== 'string') return 'none';
  const value = pattern.trim().toLowerCase();
  if (value === '<all_urls>') return 'broad';

  const match = /^(\*|https?|file):\/\/([^/]*)(\/.*)$/.exec(value);
  if (!match) return 'none';
  const [, scheme, authority] = match;

  // File URLs have no web host; permission to access local files also
  // requires separate browser/user authorization.
  if (scheme === 'file') return authority === '' ? 'scoped' : 'none';

  // Chrome match patterns allow an optional port. Do not let it hide
  // wildcard-host coverage; distinguish it from a wildcard subdomain.
  const hostPort = /^(\*|\*\.[a-z0-9.-]+|[a-z0-9.-]+|\[[a-f0-9:.]+\])(?::(\*|[0-9]{1,5}))?$/.exec(authority);
  if (!hostPort) return 'none';
  const host = hostPort[1];
  if (host === '*') return 'broad';
  if (host.startsWith('*.') && host.length > 2) return 'scoped';
  return 'scoped';
}

function finding(id, severity, title, detail, recommendation, evidence = []) {
  return { id, severity, title, detail, recommendation, evidence };
}

export function analyzeExtension(info) {
  const apiPermissions = unique(info?.permissions);
  const hostPermissions = unique(info?.hostPermissions);
  const enabled = info?.enabled === true;
  const agentCandidate = isAgentCandidate(info);
  const findings = [];
  const broadHosts = hostPermissions.filter((pattern) => classifyHostPattern(pattern) === 'broad');
  const scopedHosts = hostPermissions.filter((pattern) => classifyHostPattern(pattern) === 'scoped');

  if (broadHosts.length) {
    findings.push(finding(
      'broad-host-access', 'high', 'Broad website access',
      'Declared site patterns may cover most or all sites. This is exposure, not evidence of misuse.',
      'Review the extension\'s purpose and limit site access using Chrome controls where available.',
      broadHosts
    ));
  } else if (scopedHosts.length >= 8) {
    findings.push(finding(
      'many-hosts', 'review', 'Access to many website patterns',
      'This extension declares access to eight or more distinct website patterns.',
      'Check the list of sites and reduce access if the extension supports it.',
      [String(scopedHosts.length) + ' website patterns']
    ));
  }

  for (const permission of apiPermissions) {
    if (!Object.hasOwn(PERMISSION_RULES, permission)) continue;
    const [severity, title, detail, recommendation] = PERMISSION_RULES[permission];
    findings.push(finding('api-' + permission, severity, title, detail, recommendation, [permission]));
  }
  if (agentCandidate) {
    findings.push(finding(
      'agent-candidate', 'low', 'Possible AI-agent or automation extension',
      'Name or description matches automation-related language; this is a heuristic, not verified agent activity.',
      'If you use this tool, compare its permissions with the tasks you intended to delegate.'
    ));
  }
  if (info?.installType === 'sideload') {
    findings.push(finding(
      'sideloaded', 'review', 'Sideloaded extension',
      'Chrome reports this extension was installed by other software rather than through the usual store flow.',
      'Verify the installer and whether you intended to install it.'
    ));
  }

  findings.sort((a, b) => (SEVERITY[b.severity] - SEVERITY[a.severity]) || a.id.localeCompare(b.id));
  const observedSeverity = findings.reduce((top, item) =>
    SEVERITY[item.severity] > SEVERITY[top] ? item.severity : top, 'none');
  const severity = enabled ? observedSeverity : 'none';

  return {
    id: safeText(info?.id, 80),
    name: safeText(info?.name, 160) || 'Unnamed extension',
    description: safeText(info?.description, 320),
    version: safeText(info?.version, 64),
    enabled,
    installType: safeText(info?.installType, 30),
    agentCandidate,
    apiPermissions,
    hostPermissions,
    severity,
    inactiveExposure: !enabled && observedSeverity !== 'none',
    findings
  };
}

export function analyzeExtensions(items, selfId = '', timestamp = new Date().toISOString()) {
  const list = (Array.isArray(items) ? items : [])
    .filter((item) => item && item.type === 'extension' && item.id !== selfId)
    .map(analyzeExtension)
    .sort((a, b) =>
      (SEVERITY[b.severity] - SEVERITY[a.severity]) ||
      Number(b.agentCandidate) - Number(a.agentCandidate) ||
      a.name.localeCompare(b.name));
  return {
    schemaVersion: 1,
    scannedAt: timestamp,
    summary: {
      total: list.length,
      enabled: list.filter((x) => x.enabled).length,
      high: list.filter((x) => x.severity === 'high').length,
      review: list.filter((x) => x.severity === 'review').length,
      agentCandidates: list.filter((x) => x.agentCandidate).length
    },
    extensions: list
  };
}
