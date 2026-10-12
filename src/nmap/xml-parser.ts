import { readFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';

export type NmapXmlDocument = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export function readNmapXmlFile(path: string): string {
  return readFileSync(path, 'utf8');
}

export function parseNmapXmlString(xml: string): NmapXmlDocument {
  const doc = parser.parse(xml);
  if (doc === null || typeof doc !== 'object') {
    throw new Error('Invalid nmap XML: root must be an object');
  }
  const typed = doc as NmapXmlDocument;
  if (!typed.nmaprun) {
    throw new Error('Invalid nmap XML: missing nmaprun root element');
  }
  return typed;
}

export function loadNmapDocument(path: string): NmapXmlDocument {
  const xml = readNmapXmlFile(path);
  return parseNmapXmlString(xml);
}
