export default function configResolver() {
  return {
    debugMode: process.env.DEBUG_MODE == 'true',
    intervalSeconds: Number(process.env.FETCH_INTERVAL_SECONDS) || 90,

    discord: {
      channelId: process.env.DISCORD_CHANNEL_ID || '',
      token: process.env.DISCORD_TOKEN,
    },

    cve: {
      cvssCalculator:
        process.env.CVSS_CALCULATOR_BASE_URL ||
        'https://www.first.org/cvss/calculator/3.1#',
      cveListFile: process.env.PUBLISHED_CVE_LIST_FILE || '.cve-list',
      feedPageUrl:
        process.env.CVE_FEED_PAGE_URL ||
        'https://cassandra.cerias.purdue.edu/CVE_changes/today.html',
      pageBaseUrl:
        process.env.CVE_PAGE_BASE_URL || 'https://nvd.nist.gov/vuln/detail/',
    },

    cwe: {
      baseUrl:
        process.env.CWE_BASE_URL || 'https://cwe.mitre.org/data/definitions/',
    },
  };
}
