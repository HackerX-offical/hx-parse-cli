# hx-parse-cli

Ingest **Nmap XML** (and future Masscan) into engagement-ready **JSON + Markdown** for
reports and `hx-graph merge`.

```bash
nmap -oX scan.xml target
hx-parse nmap scan.xml -o report.md --json
```

HackerX License

## License

Licensed under the [HackerX License](./LICENSE). Redistributions must retain copyright,
license text, and [NOTICE](./NOTICE) attribution per the license terms.
