import { join } from 'node:path';
import { ingestNmapXml } from '../src/nmap/index.js';
import { hostsToCsv, resultToCsv } from '../src/nmap/reporters/csv.js';
import { hostsToJson, resultToJson } from '../src/nmap/reporters/json.js';
import { hostsToMarkdown, resultToMarkdown } from '../src/nmap/reporters/markdown.js';

const fixture = join(import.meta.dirname, 'fixtures', 'sample-nmap.xml');

describe('reporters', () => {
  const result = ingestNmapXml(fixture);

  it('markdown includes risk column and host sections', () => {
    const md = hostsToMarkdown(result.hosts);
    expect(md).toContain('# Scan ingest report');
    expect(md).toContain('## 10.0.0.1');
    expect(md).toContain('| Risk |');
    expect(md).toContain('cleartext-legacy');
  });

  it('result markdown includes meta block', () => {
    const md = resultToMarkdown(result);
    expect(md).toContain('Open ports:');
    expect(md).toContain('10.0.0.50');
  });

  it('json round-trips host count', () => {
    const parsed = JSON.parse(resultToJson(result)) as { meta: { hostCount: number } };
    expect(parsed.meta.hostCount).toBe(2);
    expect(JSON.parse(hostsToJson(result.hosts)).hosts).toHaveLength(2);
  });

  it('csv emits one row per open port', () => {
    const csv = resultToCsv(result);
    const lines = csv.trim().split('\n');
    expect(lines[0]).toContain('risk_tags');
    expect(lines.length).toBe(1 + 5);
    expect(hostsToCsv(result.hosts)).toBe(csv);
  });
});
