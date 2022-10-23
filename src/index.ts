import { CveFeed } from './modules/cve-feed.js';
import configResolver from './config.js';
import * as dotenv from 'dotenv';
import { Client, GatewayIntentBits, MessageFlags } from 'discord.js';
import { NvdWeakness } from 'modules/nvd-api.js';

dotenv.config();
const config = configResolver();

const cveFeed = new CveFeed({
  feedPageUrl: config.cve.feedPageUrl,
  cveListFile: config.cve.cveListFile,
  debugMode: config.debugMode,
});

const discordClient = new Client({ intents: GatewayIntentBits.Guilds });
discordClient.login(config.discord.token);

setInterval(main, config.intervalSeconds * 1000);

async function main(): Promise<void> {
  const channel = await discordClient.channels.cache.get(
    config.discord.channelId,
  );

  if (!channel?.isTextBased()) {
    console.warn('[WARN] Configured channel is not a text channel!');
    return;
  }

  const fetchListResponse = await cveFeed.fetchList();
  if (fetchListResponse.failed) {
    console.warn('[WARN] ' + fetchListResponse.message);
    return;
  }

  const cve = await cveFeed.fetchNextCve();
  if (!cve) {
    return;
  }

  if (
    cve.descriptions[0].value.indexOf('DO NOT USE THIS CANDIDATE NUMBER') != -1
  ) {
    console.log(`[INFO] ${cve.id} ignored because it was withdrawn`);
    return;
  }

  const cvssMetric =
    typeof cve.metrics['cvssMetricV31'] != 'undefined'
      ? cve.metrics['cvssMetricV31'][0]
      : null;

  const baseScore = cvssMetric?.cvssData.baseScore;
  const vectorString = cvssMetric?.cvssData.vectorString;
  const cvssCalculatorUrl = config.cve.cvssCalculator + vectorString;

  const weaknesses = new Set();

  cve.weaknesses?.forEach((weakness: NvdWeakness) => {
    weakness.description.forEach((description) => {
      if (description.value == 'NVD-CWE-noinfo') {
        return;
      }

      const [, cweId] = description.value.split('-');
      weaknesses.add(
        `* ${description.value} | ${config.cwe.baseUrl}${cweId}.html`,
      );
    });
  });

  const references = cve.references?.map((reference) => {
    return `* ${reference.url}`;
  });

  channel.send({
    flags: MessageFlags.SuppressEmbeds,
    content:
      `**${cve.id}** | CVSS: **${baseScore || 'N/A'}**\n` +
      `\n` +
      `${cve.descriptions[0].value}\n` +
      `\n` +
      `Published at: ${cve.published}\n` +
      `CVE Page: ${config.cve.pageBaseUrl + cve.id}\n` +
      `CVSS Calculator: ${
        vectorString ? cvssCalculatorUrl : 'CVSS has not been calculated'
      }\n` +
      `\n` +
      `**WEAKNESSES**\n` +
      `\n` +
      `${Array.from(weaknesses).join('\n')}\n` +
      `\n` +
      `**REFERENCES**\n` +
      `\n` +
      `${references?.join('\n')}\n`,
  });

  console.log(`[INFO] ${cve.id} published`);
}
