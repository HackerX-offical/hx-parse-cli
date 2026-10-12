import type { HostFinding, NmapIngestResult } from '../types.js';

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function hostsToCsv(hosts: HostFinding[]): string {
  const header = [
    'ip',
    'hostnames',
    'port',
    'protocol',
    'state',
    'service',
    'product',
    'version',
    'risk_tags',
  ];
  const rows: string[] = [header.join(',')];

  for (const host of hosts) {
    const hostnames = host.hostnames.join(';');
    if (host.ports.length === 0) {
      rows.push(
        [host.ip, hostnames, '', '', '', '', '', '', ''].map((c) => escapeCsv(c)).join(','),
      );
      continue;
    }
    for (const p of host.ports) {
      rows.push(
        [
          host.ip,
          hostnames,
          String(p.port),
          p.protocol,
          p.state,
          p.service ?? '',
          p.product ?? '',
          p.version ?? '',
          p.riskTags.join(';'),
        ]
          .map((c) => escapeCsv(c))
          .join(','),
      );
    }
  }

  return rows.join('\n') + '\n';
}

export function resultToCsv(result: NmapIngestResult): string {
  return hostsToCsv(result.hosts);
}
