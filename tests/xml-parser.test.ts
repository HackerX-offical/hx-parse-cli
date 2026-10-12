import { join } from 'node:path';
import { loadNmapDocument, parseNmapXmlString } from '../src/nmap/xml-parser.js';

const fixture = join(import.meta.dirname, 'fixtures', 'sample-nmap.xml');

describe('xml-parser', () => {
  it('loads fixture from disk', () => {
    const doc = loadNmapDocument(fixture);
    expect(doc.nmaprun).toBeDefined();
  });

  it('parses inline XML', () => {
    const doc = parseNmapXmlString('<nmaprun><host/></nmaprun>');
    const run = doc.nmaprun as { host?: unknown };
    expect(run.host).toBeDefined();
  });

  it('throws when nmaprun root is missing', () => {
    expect(() => parseNmapXmlString('<scan/>')).toThrow(/nmaprun/);
  });
});
