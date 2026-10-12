import type { NmapXmlDocument } from './xml-parser.js';

export interface RawNmapHost {
  address?: unknown;
  hostnames?: unknown;
  ports?: unknown;
}

type AttrRecord = Record<string, string>;

function asAttrRecord(value: unknown): AttrRecord | undefined {
  if (value !== null && typeof value === 'object') {
    return value as AttrRecord;
  }
  return undefined;
}

export function extractRawHosts(doc: NmapXmlDocument): RawNmapHost[] {
  const nmaprun = doc.nmaprun as { host?: unknown } | undefined;
  const hosts = nmaprun?.host ?? [];
  if (Array.isArray(hosts)) {
    return hosts as RawNmapHost[];
  }
  if (hosts) {
    return [hosts as RawNmapHost];
  }
  return [];
}

export function extractIp(host: RawNmapHost): string {
  const addr = host.address;
  if (Array.isArray(addr)) {
    const ipv4 = addr.find((a) => asAttrRecord(a)?.['@_addrtype'] === 'ipv4');
    const chosen = ipv4 ?? addr[0];
    return asAttrRecord(chosen)?.['@_addr'] ?? '';
  }
  return asAttrRecord(addr)?.['@_addr'] ?? '';
}

export function extractHostnames(host: RawNmapHost): string[] {
  const names: string[] = [];
  const hostnames = host.hostnames as { hostname?: unknown } | undefined;
  const hn = hostnames?.hostname;
  if (Array.isArray(hn)) {
    for (const entry of hn) {
      const name = asAttrRecord(entry)?.['@_name'];
      if (name) names.push(name);
    }
  } else if (hn) {
    const name = asAttrRecord(hn)?.['@_name'];
    if (name) names.push(name);
  }
  return names;
}

export function extractRawPorts(host: RawNmapHost): unknown[] {
  const portsBlock = host.ports as { port?: unknown } | undefined;
  const portsRaw = portsBlock?.port;
  if (Array.isArray(portsRaw)) return portsRaw;
  if (portsRaw) return [portsRaw];
  return [];
}
