import type { PortFinding } from './types.js';

const PORT_RISK: Readonly<Record<number, readonly string[]>> = {
  21: ['cleartext-legacy', 'ftp'],
  23: ['cleartext-legacy', 'telnet'],
  25: ['mail-exposed'],
  135: ['windows-rpc'],
  139: ['netbios'],
  445: ['smb', 'lateral-movement'],
  1433: ['database-exposed', 'mssql'],
  1521: ['database-exposed', 'oracle'],
  3306: ['database-exposed', 'mysql'],
  3389: ['remote-admin', 'rdp'],
  5432: ['database-exposed', 'postgresql'],
  5900: ['remote-admin', 'vnc'],
  6379: ['database-exposed', 'redis-unauth-risk'],
  9200: ['search-exposed', 'elasticsearch'],
  27017: ['database-exposed', 'mongodb'],
};

const SERVICE_RISK: Readonly<Record<string, readonly string[]>> = {
  telnet: ['cleartext-legacy'],
  ftp: ['cleartext-legacy'],
  redis: ['database-exposed', 'redis-unauth-risk'],
  vnc: ['remote-admin'],
  'ms-wbt-server': ['remote-admin', 'rdp'],
  'microsoft-ds': ['smb'],
};

function unique(tags: string[]): string[] {
  return [...new Set(tags)];
}

export function tagPortRisk(port: PortFinding): string[] {
  const tags: string[] = [];

  const byPort = PORT_RISK[port.port];
  if (byPort) tags.push(...byPort);

  const svc = port.service?.toLowerCase();
  if (svc) {
    const byService = SERVICE_RISK[svc];
    if (byService) tags.push(...byService);
  }

  if (port.port === 443 || port.port === 22) {
    tags.push('expected-edge');
  }

  return unique(tags);
}

export function applyRiskTags(port: PortFinding): PortFinding {
  const riskTags = tagPortRisk(port);
  return riskTags.length > 0 ? { ...port, riskTags } : { ...port, riskTags: [] };
}
