import type { HostFinding, NmapIngestResult } from '../types.js';

export function hostsToJson(hosts: HostFinding[], pretty = true): string {
  const payload = { hosts };
  return pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload);
}

export function resultToJson(result: NmapIngestResult, pretty = true): string {
  return pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);
}
