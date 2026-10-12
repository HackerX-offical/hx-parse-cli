# hx-parse-cli

Ingest **Nmap XML** (and future Masscan) into engagement-ready **JSON + Markdown** for reports and `hx-graph merge`.

```bash
nmap -oX scan.xml target
hx-parse nmap scan.xml -o report.md --json
```

MIT — HackerX Official
