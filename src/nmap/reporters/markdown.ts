import type { HostFinding, NmapIngestResult } from '../types.js';

export function hostsToMarkdown(hosts: HostFinding[], title = 'Scan ingest report'): string {
  const lines = [`# ${title}`, ''];
  for (const h of hosts) {
    const nameSuffix = h.hostnames.length > 0 ? ` (${h.hostnames.join(', ')})` : '';
    lines.push(`## ${h.ip}${nameSuffix}`);
    lines.push('| Port | Proto | Service | Product | Risk |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const p of h.ports) {
      const product = [p.product, p.version].filter(Boolean).join(' ');
      const risk = p.riskTags.length > 0 ? p.riskTags.join(', ') : '—';
      lines.push(`| ${p.port} | ${p.protocol} | ${p.service ?? ''} | ${product} | ${risk} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export function toMarkdown(hosts: HostFinding[]): string {
  return hostsToMarkdown(hosts);
}

export function resultToMarkdown(result: NmapIngestResult): string {
  const header = [
    `# ${'Scan ingest report'}`,
    '',
    `- Scanner: ${result.meta.scanner}`,
    `- Generated: ${result.meta.generatedAt}`,
    `- Hosts: ${result.meta.hostCount}`,
    `- Open ports: ${result.meta.openPortCount}`,
    '',
  ].join('\n');
  return header + hostsToMarkdown(result.hosts, 'Hosts');
}
