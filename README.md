# Sauerbraten IRC To Discord

A little Node.js application that echoes Remod server messages from IRC in Discord with nice formatting.

## Installation

Before installing this bot you need to install Node.js. I only tested with v7.10.0 but other recent versions should work too.

Install the bot:

```
git clone https://github.com/AngrySnout/sauer-irc-to-discord.git
cd sauer-irc-to-discord
npm install
```

Then open main.js in a text editor and edit the following lines:

```
const ircName = "sauer-irc-to-discord";
const ircChannels = ["#channel"];
const discordToken = 'token';
const discordChannelID = 'id';
```

to reflect the bot's name in IRC, the IRC channels it should echo from, the Discord token, and the Discord channel it should echo in.

Finally, start the bot:

```
npm start
```

## License

MIT
