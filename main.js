const irc = require("irc");
const Discord = require('discord.js');
const discordClient = new Discord.Client();

const ircName = "sauer-irc-to-discord";
const ircChannels = ["#channel"];
const discordToken = 'token';
const discordChannelID = 'id';

let lastFrom = "";

ircClient = new irc.Client("burstfire.uk.eu.gamesurge.net", ircName, {
    userName: ircName,
    realName: ircName,
    channels: ircChannels,
    autoRejoin: true,
    floodProtection: true
});

ircClient.addListener('message', function(from, to, message) {
    let description = "";
    let color = 0x9c2525;
    let messageURL = "";
    let authorName = "";
    let authorURL = "";
    
    // chat message
    let res = message.match(/(.*)\(\d*\): (.*)/)
    if (res && res.length == 3) {
        description = res[2];
        color = 0x888888;
        authorName = res[1];
        authorURL = `https://sauertracker.net/player/${authorName}`;
    }
    
    // connect message
    res = message.match(/CONNECT (.*)\(\d*\) \((.*)\)/);
    if (res && res.length == 3) {
        description = `Connected from ${res[2]}`;
        color = 0x4d8e1b;
        authorName = res[1];
        authorURL = `https://sauertracker.net/player/${authorName}`;
    }
    
    // disconnect message
    res = message.match(/DISCONNECT (.*)\(\d*\) - Connection time: (\d*)/);
    if (res && res.length == 3) {
        description = `Diconnected after ${res[2]}`;
        color = 0x4d8e1b;
        authorName = res[1];
        authorURL = `https://sauertracker.net/player/${authorName}`;
    }
    
    // map changed message
    res = message.match(/MAP CHANGED: (.*)/);
    if (res && res.length == 2) {
        description = `Map changed to ${res[1]}`;
        color = 0x1b7f8e;
    }
    
    // game ended message
    res = message.match(/GAME ENDED (.*) players: (.*)\| (.*)/);
    if (res && res.length == 4) {
        description = `Game ended: **${res[1]}**\n`;
        description += `Players: **${res[2]}**\n`;
        description += `Ranks:\n`;
        res = res[3].match(/\d+\. [^ ]*\(\d*\) \([^ ]* [^ ]*\)/g);
        for (let rank of res) {
            let res2 = rank.match(/(\d+)\. ([^ ]*)\(\d*\) \(([^ ]* [^ ]*)\)/);
            if (res2 && res2.length == 4) {
                description += `**${res2[1]}**. ${res2[2]} *(${res2[3]})*\n`;
            }
        }
        color = 0x1b7f8e;
    }
    
    if (!description) return;
    const channel = discordClient.channels.find('id', discordChannelID);
    const embed = { type: "rich", description, color };
    if (messageURL) embed.url = messageURL;
    if (authorName) {
        embed.author = { name: authorName };
        if (authorURL) embed.author.url = authorURL;
    }
    
    if (from != lastFrom) {
        channel.send(`**${from}**`);
        lastFrom = from;
    }
    channel.send({ embed });
});

ircClient.addListener("error", function(message) {
    return console.log("IRC Error: ", message);
});

discordClient.on('ready', () => {
    console.log('I am ready!');
});

discordClient.login(discordToken);
