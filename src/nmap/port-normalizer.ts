import type { PortFinding } from './types.js';
import { extractRawPorts, type RawNmapHost } from './host-extractor.js';

type AttrRecord = Record<string, string>;

function attrs(value: unknown): AttrRecord {
  if (value !== null && typeof value === 'object') {
    return value as AttrRecord;
  }
  return {};
}

export function normalizePort(raw: unknown): PortFinding {
  const portNode = attrs(raw);
  const stateNode = attrs((raw as { state?: unknown })?.state);
  const svc = attrs((raw as { service?: unknown })?.service);

  const portId = portNode['@_portid'];
  const parsedPort = Number(portId);
  if (!Number.isFinite(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
    throw new Error(`Invalid port id in nmap XML: ${String(portId)}`);
  }

  return {
    port: parsedPort,
    protocol: portNode['@_protocol'] ?? 'unknown',
    state: stateNode['@_state'] ?? 'unknown',
    service: svc['@_name'],
    product: svc['@_product'],
    version: svc['@_version'],
    riskTags: [],
  };
}

export function normalizeHostPorts(host: RawNmapHost, onlyOpen = true): PortFinding[] {
  const ports = extractRawPorts(host).map(normalizePort);
  if (!onlyOpen) return ports;
  return ports.filter((p) => p.state === 'open');
}
