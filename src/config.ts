export default function configResolver() {
  return {
    intervalSeconds: Number(process.env.FETCH_INTERVAL_SECONDS) || 25,

    discord: {
      channelId: process.env.DISCORD_CHANNEL_ID || '',
      token: process.env.DISCORD_TOKEN,
    },

    cve: {
      cvssCalculator:
        process.env.CVSS_CALCULATOR_BASE_URL ||
        'https://www.first.org/cvss/calculator/3.1#',
      feedPageUrl:
        process.env.CVE_FEED_PAGE_URL ||
        'https://cassandra.cerias.purdue.edu/CVE_changes/CVE.2022.10.10.html',
      pageBaseUrl:
        process.env.CVE_PAGE_BASE_URL || 'https://nvd.nist.gov/vuln/detail/',
    },

    cwe: {
      baseUrl:
        process.env.CWE_BASE_URL || 'https://cwe.mitre.org/data/definitions/',
    },
  };
}
