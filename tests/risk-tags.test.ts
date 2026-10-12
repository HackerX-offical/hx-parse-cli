import { applyRiskTags, tagPortRisk } from '../src/nmap/risk-tags.js';
import type { PortFinding } from '../src/nmap/types.js';

function port(overrides: Partial<PortFinding> & Pick<PortFinding, 'port'>): PortFinding {
  return {
    protocol: 'tcp',
    state: 'open',
    riskTags: [],
    ...overrides,
  };
}

describe('risk-tags', () => {
  it('tags telnet and smb exposure', () => {
    const telnet = tagPortRisk(port({ port: 23, service: 'telnet' }));
    expect(telnet).toContain('cleartext-legacy');
    expect(telnet).toContain('telnet');

    const smb = tagPortRisk(port({ port: 445, service: 'microsoft-ds' }));
    expect(smb).toContain('smb');
    expect(smb).toContain('lateral-movement');
  });

  it('tags expected edge services', () => {
    expect(tagPortRisk(port({ port: 443, service: 'https' }))).toContain('expected-edge');
    expect(tagPortRisk(port({ port: 22, service: 'ssh' }))).toContain('expected-edge');
  });

  it('applyRiskTags returns a new object with riskTags array', () => {
    const tagged = applyRiskTags(port({ port: 3389, service: 'ms-wbt-server' }));
    expect(tagged.riskTags).toContain('rdp');
    expect(tagged.riskTags.length).toBeGreaterThan(0);
  });
});
