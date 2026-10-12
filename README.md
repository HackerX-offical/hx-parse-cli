# hx-parse-cli

**Scanner output ingest** — turn Nmap XML (`-oX`) into normalized engagement JSON,
Markdown, or CSV reports.

## Why this exists

Nmap produces verbose XML that is hard to drop into engagement trackers or report
templates. This CLI parses `-oX` output, normalizes hosts and ports, applies risk tags,
and emits formats suitable for hx-graph pipelines or client deliverables. Use only on
scan data from authorized assessments.

## Features

- `nmap` — Parse Nmap XML path and print Markdown (default), `--json`, or `--csv`
- `-o / --out` — Write the same formatted body to a file
- Host/port normalization and optional risk tagging for common services
- No external Nmap binary required at runtime (XML input only)

## Install

```bash
git clone https://github.com/HackerX-offical/hx-parse-cli.git
cd hx-parse-cli
npm install
npm run build
npm link   # optional: global hx-parse
```

## Quick start

```bash
nmap -oX scan.xml -sV target.example.com
hx-parse nmap scan.xml
hx-parse nmap scan.xml --json -o engagement.json
hx-parse nmap scan.xml --csv
```

## Output

| Mode               | Description                              |
| ------------------ | ---------------------------------------- |
| Markdown (default) | Engagement-oriented host/port tables     |
| `--json`           | Normalized structured ingest document    |
| `--csv`            | Flat host/port rows for spreadsheets     |
| `-o`               | Writes report file using selected format |

## Develop

```bash
npm run format
npm run build
npm test
npm run format:check
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module layout and extension points.

## Ethics

Use only on systems and content you are **authorized** to test. See
[SECURITY.md](./SECURITY.md).

## License

Licensed under the [HackerX License](./LICENSE). Redistributions must retain copyright,
license text, and [NOTICE](./NOTICE) attribution per the license terms.
