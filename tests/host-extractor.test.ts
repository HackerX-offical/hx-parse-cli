import { join } from 'node:path';
import {
  extractHostnames,
  extractIp,
  extractRawHosts,
  extractRawPorts,
} from '../src/nmap/host-extractor.js';
import { loadNmapDocument } from '../src/nmap/xml-parser.js';

const fixture = join(import.meta.dirname, 'fixtures', 'sample-nmap.xml');

describe('host-extractor', () => {
  const hosts = extractRawHosts(loadNmapDocument(fixture));

  it('extracts two hosts', () => {
    expect(hosts).toHaveLength(2);
  });

  it('prefers ipv4 when multiple addresses exist', () => {
    expect(extractIp(hosts[1])).toBe('10.0.0.50');
  });

  it('collects hostnames', () => {
    expect(extractHostnames(hosts[0])).toEqual(['app.internal', 'app']);
    expect(extractHostnames(hosts[1])).toEqual([]);
  });

  it('lists raw ports per host', () => {
    expect(extractRawPorts(hosts[0])).toHaveLength(3);
    expect(extractRawPorts(hosts[1])).toHaveLength(3);
  });
});
