import { buildNmapIngestMeta, buildNmapIngestResult } from '../src/engagement.js';
import type { HostFinding } from '../src/nmap/types.js';

const hosts: HostFinding[] = [
  {
    ip: '1.2.3.4',
    hostnames: [],
    ports: [
      { port: 80, protocol: 'tcp', state: 'open', riskTags: [] },
      { port: 443, protocol: 'tcp', state: 'open', riskTags: ['expected-edge'] },
    ],
  },
];

describe('engagement', () => {
  it('aggregates open port counts', () => {
    const meta = buildNmapIngestMeta(hosts);
    expect(meta.scanner).toBe('nmap');
    expect(meta.hostCount).toBe(1);
    expect(meta.openPortCount).toBe(2);
    expect(meta.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('wraps hosts with meta', () => {
    const result = buildNmapIngestResult(hosts);
    expect(result.hosts).toBe(hosts);
    expect(result.meta.openPortCount).toBe(2);
  });
});
