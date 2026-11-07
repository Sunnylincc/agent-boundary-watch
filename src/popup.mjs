import { analyzeExtensions } from './risk.mjs';
import { serializeReport } from './report.mjs';

const $ = (id) => document.getElementById(id);
const scanButton = $('scanButton');
const exportButton = $('exportButton');
const status = $('status');
const results = $('results');
const filters = $('filters');
let assessment = null;
let activeFilter = 'all';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function showStatus(message, state = 'neutral') {
  status.textContent = message;
  status.dataset.state = state;
}
function setBusy(busy) {
  scanButton.disabled = busy;
  scanButton.textContent = busy ? 'Scanning…' : assessment ? 'Scan again' : 'Scan browser';
}
function severityLabel(value) {
  return value === 'high' ? 'High exposure' : value === 'review' ? 'Needs review' : value === 'low' ? 'Info' : 'No flags';
}
function filteredExtensions() {
  if (!assessment) return [];
  if (activeFilter === 'high') return assessment.extensions.filter((x) => x.severity === 'high');
  if (activeFilter === 'review') return assessment.extensions.filter((x) => x.severity === 'review');
  if (activeFilter === 'agents') return assessment.extensions.filter((x) => x.agentCandidate);
  return assessment.extensions;
}
function renderCard(info) {
  const card = element('article', 'extension-card');
  const header = element('div', 'extension-top');
  const monogram = element('div', 'monogram', info.name.slice(0, 1).toUpperCase());
  monogram.setAttribute('aria-hidden', 'true');
  const body = element('div', 'extension-meta');
  const name = element('div', 'extension-name', info.name);
  name.title = info.name;
  const sub = element('div', 'extension-sub', [
    info.enabled ? 'Enabled' : 'Disabled',
    info.agentCandidate ? 'Possible automation' : null,
    info.version ? 'v' + info.version : null
  ].filter(Boolean).join(' · '));
  body.append(name, sub);
  const severity = element('span', 'severity severity-' + info.severity, severityLabel(info.severity));
  header.append(monogram, body, severity);
  card.append(header);

  const summary = element('p', 'extension-desc', info.description || 'No extension description provided.');
  card.append(summary);
  const pills = element('div', 'pill-row');
  const api = element('span', 'info-pill', info.apiPermissions.length + ' API permissions');
  const hosts = element('span', 'info-pill', info.hostPermissions.length + ' host patterns');
  pills.append(api, hosts);
  card.append(pills);

  const details = element('details', 'details');
  details.append(element('summary', '', 'Review findings & permissions'));
  const inside = element('div', 'details-content');
  if (!info.findings.length) {
    inside.append(element('p', 'small-copy', 'No rules matched. This is not a security certification.'));
  } else {
    for (const finding of info.findings) {
      const block = element('div', 'finding');
      const title = element('div', 'finding-title');
      title.append(element('span', 'dot dot-' + finding.severity), element('strong', '', finding.title));
      block.append(title, element('p', '', finding.detail), element('p', 'advice', finding.recommendation));
      if (finding.evidence.length) block.append(element('code', 'evidence', finding.evidence.join(', ')));
      inside.append(block);
    }
  }
  if (info.apiPermissions.length) {
    inside.append(element('div', 'list-label', 'Declared API permissions'));
    inside.append(element('p', 'wrap-list', info.apiPermissions.join(' · ')));
  }
  if (info.hostPermissions.length) {
    inside.append(element('div', 'list-label', 'Declared host patterns'));
    inside.append(element('p', 'wrap-list', info.hostPermissions.join(' · ')));
  }
  if (!info.enabled) {
    inside.append(element('p', 'small-copy', 'Disabled: findings describe declared capabilities, not active access.'));
  }
  details.append(inside);
  card.append(details);
  return card;
}
function render() {
  results.replaceChildren();
  if (!assessment) return;
  $('totalCount').textContent = String(assessment.summary.total);
  $('highCount').textContent = String(assessment.summary.high);
  $('reviewCount').textContent = String(assessment.summary.review);
  $('agentCount').textContent = String(assessment.summary.agentCandidates);
  $('stats').hidden = false;
  filters.hidden = false;
  exportButton.hidden = false;
  for (const button of filters.querySelectorAll('button')) {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
  const list = filteredExtensions();
  if (!list.length) {
    results.append(element('p', 'empty-result', 'No matching extensions in this view.'));
    return;
  }
  for (const extension of list) results.append(renderCard(extension));
}

scanButton.addEventListener('click', async () => {
  // Permission request MUST originate from this direct user click.
  setBusy(true);
  showStatus('Requesting permission to inspect installed extensions…');
  try {
    if (!globalThis.chrome?.permissions || !globalThis.chrome?.management) {
      throw new Error('Open this popup as a Chrome extension to scan.');
    }
    const granted = await chrome.permissions.request({ permissions: ['management'] });
    if (!granted) {
      showStatus('Permission was not granted. Nothing was scanned.', 'warning');
      return;
    }
    showStatus('Reading extension permissions…');
    const entries = await chrome.management.getAll();
    assessment = analyzeExtensions(entries, chrome.runtime.id);
    activeFilter = 'all';
    render();
    showStatus('Local scan complete. Review exposure flags, not proof of misuse.', 'success');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    showStatus('Scan failed: ' + message, 'error');
  } finally {
    setBusy(false);
  }
});

filters.addEventListener('click', (event) => {
  const target = event.target.closest('button[data-filter]');
  if (!target || !assessment) return;
  activeFilter = target.dataset.filter;
  render();
});

exportButton.addEventListener('click', () => {
  if (!assessment) return;
  const content = serializeReport(assessment);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'agent-boundary-watch-report.json';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
