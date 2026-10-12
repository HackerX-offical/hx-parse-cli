export interface PortFinding {
  port: number;
  protocol: string;
  state: string;
  service?: string;
  product?: string;
  version?: string;
  riskTags: string[];
}

export interface HostFinding {
  ip: string;
  hostnames: string[];
  ports: PortFinding[];
}

export interface NmapIngestMeta {
  scanner: 'nmap';
  generatedAt: string;
  hostCount: number;
  openPortCount: number;
}

export interface NmapIngestResult {
  hosts: HostFinding[];
  meta: NmapIngestMeta;
}
