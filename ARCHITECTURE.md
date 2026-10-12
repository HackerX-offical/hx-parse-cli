# hx-parse-cli architecture

Nmap XML ingest → normalized engagement structures and Markdown, JSON, or CSV reports.

## Layout

```
src/
  cli.ts                 # Commander entry (`hx-parse nmap <xml>`)
  engagement.ts          # Meta envelope (host/open-port counts, timestamps)
  nmap.ts                # Stable re-export barrel for tests and imports
  nmap/
    index.ts             # ingestNmapXml / parseNmapXml orchestration
    types.ts             # HostFinding, PortFinding, NmapIngestResult
    xml-parser.ts        # Read file + fast-xml-parser
    host-extractor.ts    # Raw <host> nodes → IP, hostnames, port list
    port-normalizer.ts   # XML port nodes → PortFinding (open-only default)
    risk-tags.ts         # Port/service heuristics → riskTags[]
    reporters/
      markdown.ts
      json.ts
      csv.ts
      index.ts
tests/
  fixtures/sample-nmap.xml
  *.test.ts              # Unit tests per module + integration
```

## Ingest pipeline

1. **xml-parser** — `loadNmapDocument(path)` reads UTF-8 and parses with
   `fast-xml-parser` (`@_` attribute prefix).
2. **host-extractor** — `extractRawHosts` normalizes single/multiple `<host>`;
   `extractIp` prefers `ipv4` when several `<address>` entries exist.
3. **port-normalizer** — Maps each `<port>` to `PortFinding`; default export filters to
   `state === 'open'`.
4. **risk-tags** — Adds engagement hints (`cleartext-legacy`, `smb`, `rdp`,
   `expected-edge`, etc.) from port number and service name.
5. **engagement** — `buildNmapIngestResult` attaches `meta` (`scanner`, `generatedAt`,
   counts).
6. **reporters** — `formatNmapIngest(result, 'markdown' | 'json' | 'csv')` for CLI and
   automation.

## CLI

```bash
nmap -oX scan.xml target
hx-parse nmap scan.xml              # Markdown to stdout
hx-parse nmap scan.xml --json
hx-parse nmap scan.xml --csv -o ports.csv
```

## Develop

```bash
npm install
npm run build
npm test
```

TypeScript compiles `src/` → `dist/` (`NodeNext` ESM). Jest uses `ts-jest` ESM preset;
tests import `.js` extensions matching emitted modules.

## Extension points

- **Masscan** — Add `src/masscan/` with the same reporter + `engagement` envelope
  pattern.
- **Risk model** — Extend `risk-tags.ts` or replace with policy files without touching
  XML parsing.
- **hx-graph** — Consume `NmapIngestResult` JSON (`hosts` + `meta`) from `--json`
  output.

See [SECURITY.md](./SECURITY.md) for authorized use.
