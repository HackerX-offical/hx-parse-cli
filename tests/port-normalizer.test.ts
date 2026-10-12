import { join } from 'node:path';
import { extractRawHosts } from '../src/nmap/host-extractor.js';
import { normalizeHostPorts, normalizePort } from '../src/nmap/port-normalizer.js';
import { loadNmapDocument } from '../src/nmap/xml-parser.js';

const fixture = join(import.meta.dirname, 'fixtures', 'sample-nmap.xml');

describe('port-normalizer', () => {
  it('keeps only open ports by default', () => {
    const [first] = extractRawHosts(loadNmapDocument(fixture));
    const open = normalizeHostPorts(first);
    expect(open.map((p) => p.port).sort()).toEqual([22, 443]);
  });

  it('maps service metadata', () => {
    const [first] = extractRawHosts(loadNmapDocument(fixture));
    const https = normalizeHostPorts(first).find((p) => p.port === 443);
    expect(https?.service).toBe('https');
    expect(https?.product).toBe('nginx');
    expect(https?.version).toBe('1.24');
  });

  it('rejects invalid port ids', () => {
    expect(() =>
      normalizePort({ '@_portid': '99999', '@_protocol': 'tcp', state: { '@_state': 'open' } }),
    ).toThrow(/Invalid port/);
  });

  it('includes closed ports when onlyOpen is false', () => {
    const [first] = extractRawHosts(loadNmapDocument(fixture));
    expect(normalizeHostPorts(first, false)).toHaveLength(3);
  });
});
