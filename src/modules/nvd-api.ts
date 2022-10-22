import fetch from 'node-fetch';

export class NvdApi {
  private baseUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

  public async getCveDetails(cveId: string): Promise<NvdCve> {
    const response = await this.get('cveId', cveId);

    if (response.totalResults < 0) {
      throw new Error(`NVD failed to get ${cveId} details.`);
    }

    return response.vulnerabilities[0].cve;
  }

  private async get(key: string, value: string): Promise<NvdResponse> {
    const response = await fetch(this.baseUrl + `?${key}=${value}`);

    if (response.status != 200) {
      throw new Error(
        `NVD API as responded with ${response.status} status code.`,
      );
    }

    try {
      return (await response.json()) as NvdResponse;
    } catch (error: unknown) {
      console.error(response);
      throw error;
    }
  }
}

export interface NvdResponse {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  format: string;
  version: string;
  timestamp: Timestamp;
  vulnerabilities: NvdVulnerability[];
}

export interface NvdVulnerability {
  cve: NvdCve;
}

export interface NvdCve {
  id: string;
  sourceIdentifier: string;
  published: Timestamp;
  lastModified: Timestamp;
  vulnStatus: string;
  descriptions: NvdCveDescription[];
  metrics: NvdCvssMetricList;
  weaknesses: NvdWeakness[];
  configurations: NvdCveConfiguration[];
  references: NvdReference[];
}

export interface NvdCveDescription {
  lang: string;
  value: string;
}

export interface NvdCvssMetricList {
  [key: string]: NvdCvssMetric[];
}

export interface NvdCvssMetric {
  source: string;
  type: string;
  cvssData: NvdCvssData;
  exploitabilityScore: number;
  impactScore: number;
}

export interface NvdCvssData {
  version: string;
  vectorString: string;
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  baseScore: number;
  baseSeverity: string;
}

export interface NvdWeakness {
  source: string;
  type: string;
  description: NvdCveDescription[];
}

export interface NvdCveConfiguration {
  nodes: NvdCveConfigurationNode[];
}

export interface NvdCveConfigurationNode {
  operator: string;
  negate: boolean;
  cpeMatch: NvdCpeMatch[];
}

export interface NvdCpeMatch {
  vulnerable: boolean;
  criteria: string;
  matchCriteriaId: string;
}

export interface NvdReference {
  url: string;
  source: string;
  tags: string[];
}

export type Timestamp = string;
