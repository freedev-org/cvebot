# cvebot

Discord bot to automatically report the latest published CVE.

![cvebot example](https://i.imgur.com/vH52ABJ.png)

## Building

```console
$ yarn build  # Build the source code
$ yarn start  # Start the bot
```

## How to configure the bot

You need to create a `.env` file on the directory of the source code with the
configurations you want to change.

Essentially you need to set the channel ID and Discord token to make it's works.
See the link below to how to get the channel ID.

A minimal `.env` example is:

```
DISCORD_CHANNEL_ID="<your-channel-id>"
DISCORD_TOKEN="<your-application-bot-token>"
```

You need to create a Discord bot with **send message** permission, get it's token
and invite it to your server. See the links below to learn how to get
these informations:

- [Where can I find my User/Server/Message ID?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID)
- [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

### .env variables

| Variable                  | Description                                                                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DISCORD_CHANNEL_ID`      | The channel's ID where the bot will send the messages.                                                                                                                                             |
| `DISCORD_TOKEN`           | Your Discord's bot token used to auth with your bot.                                                                                                                                               |
| `FETCH_INTERVAL_SECONDS`  | (optional) The interval in seconds where the bot will check and send the message about a new CVE. Default: `300`                                                                                   |
| `PUBLISHED_CVE_LIST_FILE` | (optional) File used to save a list of CVE that has already been published on your server. It is important for the bot to work well that this file survives after deployment. Default: `.cve-list` |
