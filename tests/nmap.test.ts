import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseNmapXml } from '../src/nmap.js';

const sample = `<?xml version="1.0"?>
<nmaprun>
  <host>
    <address addr="10.0.0.1" addrtype="ipv4"/>
    <hostnames><hostname name="test.local"/></hostnames>
    <ports>
      <port protocol="tcp" portid="443">
        <state state="open"/>
        <service name="https" product="nginx"/>
      </port>
    </ports>
  </host>
</nmaprun>`;

describe('parseNmapXml', () => {
  it('parses open port', () => {
    const p = join(tmpdir(), `hx-nmap-${Date.now()}.xml`);
    writeFileSync(p, sample);
    const h = parseNmapXml(p);
    expect(h[0].ports[0].port).toBe(443);
    unlinkSync(p);
  });
});
