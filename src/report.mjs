/**
 * Explicit, local export. The caller must warn that extension names, IDs and
 * declared host patterns can themselves be sensitive.
 */
export function createReport(assessment) {
  return {
    product: 'Agent Boundary Watch',
    version: '0.1.0',
    methodology: 'Static review of Chrome extension metadata and declared permissions only. Flags are not proof of compromise, active access, malicious intent, or permission escalation.',
    privacy: 'Generated locally by explicit user action. Review extension names, IDs and host patterns before sharing.',
    schemaVersion: 1,
    scannedAt: assessment.scannedAt,
    summary: { ...assessment.summary },
    extensions: assessment.extensions.map((extension) => ({
      id: extension.id,
      name: extension.name,
      version: extension.version,
      enabled: extension.enabled,
      installType: extension.installType,
      agentCandidate: extension.agentCandidate,
      severity: extension.severity,
      apiPermissions: [...extension.apiPermissions],
      hostPermissions: [...extension.hostPermissions],
      findings: extension.findings.map((f) => ({
        id: f.id,
        severity: f.severity,
        title: f.title,
        detail: f.detail,
        evidence: [...f.evidence],
        recommendation: f.recommendation
      }))
    }))
  };
}

export function serializeReport(assessment) {
  return JSON.stringify(createReport(assessment), null, 2) + '\n';
}
