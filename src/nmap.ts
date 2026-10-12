import { readFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';

export interface PortFinding {
  port: number;
  protocol: string;
  state: string;
  service?: string;
  product?: string;
  version?: string;
}

export interface HostFinding {
  ip: string;
  hostnames: string[];
  ports: PortFinding[];
}

export function parseNmapXml(path: string): HostFinding[] {
  const xml = readFileSync(path, 'utf8');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const doc = parser.parse(xml);
  const hosts = doc?.nmaprun?.host ?? [];
  const list = Array.isArray(hosts) ? hosts : [hosts];

  return list.map((h: Record<string, unknown>) => {
    const addr = (h.address as { '@_addr': string })?.['@_addr'] ?? '';
    const names: string[] = [];
    const hostnames = h.hostnames as { hostname?: unknown } | undefined;
    const hn = hostnames?.hostname;
    if (Array.isArray(hn)) hn.forEach((x: { '@_name': string }) => names.push(x['@_name']));
    else if (hn) names.push((hn as { '@_name': string })['@_name']);

    const portsBlock = h.ports as { port?: unknown } | undefined;
    const portsRaw = portsBlock?.port;
    const portsArr = Array.isArray(portsRaw) ? portsRaw : portsRaw ? [portsRaw] : [];

    const ports: PortFinding[] = portsArr.map((p: Record<string, unknown>) => {
      const state = (p.state as { '@_state': string })?.['@_state'] ?? 'unknown';
      const svc = p.service as Record<string, string> | undefined;
      return {
        port: Number((p as { '@_portid': string })['@_portid']),
        protocol: (p as { '@_protocol': string })['@_protocol'],
        state,
        service: svc?.['@_name'],
        product: svc?.['@_product'],
        version: svc?.['@_version'],
      };
    });

    return { ip: addr, hostnames: names, ports: ports.filter((p) => p.state === 'open') };
  });
}

export function toMarkdown(hosts: HostFinding[]): string {
  const lines = ['# Scan ingest report', ''];
  for (const h of hosts) {
    lines.push(`## ${h.ip} ${h.hostnames.join(', ')}`);
    lines.push('| Port | Proto | Service | Product |');
    lines.push('| --- | --- | --- | --- |');
    for (const p of h.ports) {
      lines.push(`| ${p.port} | ${p.protocol} | ${p.service ?? ''} | ${p.product ?? ''} ${p.version ?? ''} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
