#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { Command } from 'commander';
import { parseNmapXml, toMarkdown } from './nmap.js';

const program = new Command();
program.name('hx-parse').description('Scanner output ingest engine').version('1.0.0');

program
  .command('nmap')
  .argument('<xml>', 'nmap -oX output')
  .option('-o, --out <path>', 'write Markdown report')
  .option('--json', 'JSON to stdout')
  .action((xml: string, opts: { out?: string; json?: boolean }) => {
    const hosts = parseNmapXml(xml);
    if (opts.json) console.log(JSON.stringify({ hosts }, null, 2));
    else console.log(toMarkdown(hosts));
    if (opts.out) writeFileSync(opts.out, toMarkdown(hosts), 'utf8');
  });

program.parse();
