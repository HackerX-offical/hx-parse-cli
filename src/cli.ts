#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { Command } from 'commander';
import { formatNmapIngest, ingestNmapXml } from './nmap/index.js';

type OutputFormat = 'markdown' | 'json' | 'csv';

function resolveFormat(opts: { json?: boolean; csv?: boolean }): OutputFormat {
  if (opts.json) return 'json';
  if (opts.csv) return 'csv';
  return 'markdown';
}

const program = new Command();
program.name('hx-parse').description('Scanner output ingest engine').version('1.0.0');

program
  .command('nmap')
  .argument('<xml>', 'nmap -oX output')
  .option('-o, --out <path>', 'write report to file (format follows --json/--csv)')
  .option('--json', 'JSON to stdout')
  .option('--csv', 'CSV to stdout')
  .action((xml: string, opts: { out?: string; json?: boolean; csv?: boolean }) => {
    const result = ingestNmapXml(xml);
    const format = resolveFormat(opts);
    const body = formatNmapIngest(result, format);
    console.log(body);
    if (opts.out) writeFileSync(opts.out, body, 'utf8');
  });

program.parse();
