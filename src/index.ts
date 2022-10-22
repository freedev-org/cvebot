import { CveFeed } from './modules/cve-feed.js';
import configResolver from './config.js';
import * as dotenv from 'dotenv';
import { Client, GatewayIntentBits, MessageFlags } from 'discord.js';

dotenv.config();
const config = configResolver();

const cveFeed = new CveFeed({
  feedPageUrl: config.cve.feedPageUrl,
  cveListFile: config.cve.cveListFile,
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

  const baseScore = cve.metrics['cvssMetricV31'][0].cvssData.baseScore;
  const cvssCalculatorUrl =
    config.cve.cvssCalculator +
    cve.metrics['cvssMetricV31'][0].cvssData.vectorString;

  const weaknesses = new Set();

  cve.weaknesses.forEach((weakness) => {
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

  const references = cve.references.map((reference) => {
    return `* ${reference.url}`;
  });

  channel.send({
    flags: MessageFlags.SuppressEmbeds,
    content:
      `**${cve.id}** | CVSS: **${baseScore}**\n` +
      `\n` +
      `${cve.descriptions[0].value}\n` +
      `\n` +
      `Published at: ${cve.published}\n` +
      `CVE Page: ${config.cve.pageBaseUrl + cve.id}\n` +
      `CVSS Calculator: ${cvssCalculatorUrl}\n` +
      `\n` +
      `**WEAKNESSES**\n` +
      `\n` +
      `${Array.from(weaknesses).join('\n')}\n` +
      `\n` +
      `**REFERENCES**\n` +
      `\n` +
      `${references.join('\n')}\n`,
  });

  console.log('[PUBLISHED] ' + cve.id);
}
