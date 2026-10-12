import { join } from 'node:path';
import { parseNmapXml, ingestNmapXml, toMarkdown } from '../src/nmap.js';

const fixture = join(import.meta.dirname, 'fixtures', 'sample-nmap.xml');

describe('parseNmapXml integration', () => {
  it('parses fixture open ports and risk tags', () => {
    const hosts = parseNmapXml(fixture);
    expect(hosts).toHaveLength(2);

    const app = hosts.find((h) => h.ip === '10.0.0.1');
    expect(app?.hostnames).toContain('app.internal');
    expect(app?.ports.map((p) => p.port).sort()).toEqual([22, 443]);

    const legacy = hosts.find((h) => h.ip === '10.0.0.50');
    const telnet = legacy?.ports.find((p) => p.port === 23);
    expect(telnet?.riskTags).toContain('telnet');
  });

  it('ingest attaches meta', () => {
    const result = ingestNmapXml(fixture);
    expect(result.meta.hostCount).toBe(2);
    expect(result.meta.openPortCount).toBe(5);
  });

  it('toMarkdown remains available from barrel', () => {
    const md = toMarkdown(parseNmapXml(fixture));
    expect(md).toContain('10.0.0.1');
  });
});
