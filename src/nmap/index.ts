import { buildNmapIngestResult } from '../engagement.js';
import { extractHostnames, extractIp, extractRawHosts } from './host-extractor.js';
import { normalizeHostPorts } from './port-normalizer.js';
import { applyRiskTags } from './risk-tags.js';
import { toMarkdown, resultToJson, resultToCsv } from './reporters/index.js';
import { loadNmapDocument } from './xml-parser.js';
import type { HostFinding, NmapIngestResult } from './types.js';

export type { HostFinding, PortFinding, NmapIngestMeta, NmapIngestResult } from './types.js';
export { toMarkdown, resultToMarkdown, hostsToMarkdown } from './reporters/markdown.js';
export { hostsToJson, resultToJson } from './reporters/json.js';
export { hostsToCsv, resultToCsv } from './reporters/csv.js';
export { tagPortRisk, applyRiskTags } from './risk-tags.js';
export { loadNmapDocument, parseNmapXmlString } from './xml-parser.js';

export function parseNmapXml(path: string): HostFinding[] {
  return ingestNmapXml(path).hosts;
}

export function ingestNmapXml(path: string): NmapIngestResult {
  const doc = loadNmapDocument(path);
  const rawHosts = extractRawHosts(doc);

  const hosts: HostFinding[] = rawHosts.map((raw) => ({
    ip: extractIp(raw),
    hostnames: extractHostnames(raw),
    ports: normalizeHostPorts(raw).map(applyRiskTags),
  }));

  return buildNmapIngestResult(hosts);
}

export function formatNmapIngest(
  result: NmapIngestResult,
  format: 'markdown' | 'json' | 'csv',
): string {
  switch (format) {
    case 'json':
      return resultToJson(result);
    case 'csv':
      return resultToCsv(result);
    case 'markdown':
    default:
      return toMarkdown(result.hosts);
  }
}
