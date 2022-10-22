export default {
  cve: {
    feedPageUrl:
      process.env.CVE_FEED_PAGE_URL ||
      'https://cassandra.cerias.purdue.edu/CVE_changes/today.html',
    pageBaseUrl:
      process.env.CVE_PAGE_BASE_URL || 'https://nvd.nist.gov/vuln/detail/',
  },
};
