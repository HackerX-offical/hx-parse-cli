import type { HostFinding, NmapIngestMeta, NmapIngestResult } from './nmap/types.js';

export function buildNmapIngestMeta(hosts: HostFinding[]): NmapIngestMeta {
  const openPortCount = hosts.reduce((sum, h) => sum + h.ports.length, 0);
  return {
    scanner: 'nmap',
    generatedAt: new Date().toISOString(),
    hostCount: hosts.length,
    openPortCount,
  };
}

export function buildNmapIngestResult(hosts: HostFinding[]): NmapIngestResult {
  return {
    hosts,
    meta: buildNmapIngestMeta(hosts),
  };
}
