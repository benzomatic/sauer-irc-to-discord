const irc = require("irc");
const Discord = require('discord.js');
const discordClient = new Discord.Client();

const ircName = "rigatoni2discord";
const ircChannels = ["#channel"];
const discordToken = 'token';
const discordChannelID = 'id';

let botname = "Rigatoni"; // name of the Rigatoni IRC-Bot. Should it change, you can change the botalias from discord with .botname <current_IRC_name>

ircClient = new irc.Client("burstfire.uk.eu.gamesurge.net", ircName, {
    userName: ircName,
    realName: ircName,
    channels: ircChannels,
    autoRejoin: true,
    floodProtection: true,
    stripColors: true  // Thank you for this option. No seriously, thank you.
});

ircClient.addListener('message', function(from, to, message) {
    let ok = false;
    if (from === botname) {  // only parse messages from the actual Rigatoni bot, display messages of other IRC-Clients in another style

        let description = "";
        let color = 0x9c2525;
        let messageURL = "";
        let authorName = "";
        let authorURL = "";
        
        // chat message
        let res = message.match(/^(\S*)\s\((\d*)\):\s(.*)/);
        if (res && !ok) {
            description = `${res[3]}`;
            color = 0x888888;
            authorName = `${res[1]} (${res[2]})`;
            authorURL = `https://sauertracker.net/player/${res[1]}`;
            ok = true;
        }
        
        // rename message
        res = message.match(/^RENAME:\s(\S*)\s\((\d*)\)\sis\snow\sknown\sas\s(\S*)/);
        if (res && !ok) {
            description = `**RENAME:** ${res[1]} (${res[2]}) is now known as ${res[3]}`;
            color = 0xb6b6b6;
            ok = true;
        }
        
        // connect message
        res = message.match(/^CONNECT:\s(.*)\s\((\d*)\)(\s\((.*)\))?/);
        if (res && !ok) {
            if(res[4] !== undefined) {
                description = `Connected from ${res[4]}`;        
            } else {
                description = `Connected (unknown country)`;
            }
            color = 0x6485ff;
            authorName = `${res[1]} (${res[2]})`;
            authorURL = `https://sauertracker.net/player/${res[1]}`;
            ok = true;
        }
        
        // disconnect message
        res = message.match(/^DISCONNECT:\s(.*)\s\((\d*)\)\s-\sConnection\stime:\s(.*)/);
        if (res && !ok) {
            description = `Disconnected after ${res[3]}`;
            color = 0x0036f9;
            authorName = `${res[1]} (${res[2]})`;
            authorURL = `https://sauertracker.net/player/${res[1]}`;
            ok = true;
        }
    
        // new game message
        res = message.match(/^NEW\sGAME:\s(.*)/);
        if (res && !ok) {
            description = `**NEW GAME:** ${res[1]}`;
            color = 0x0aff01;
            ok = true;
        }
        
            
        // kick message
        res = message.match(/^KICK:\s(.*)\sbans\s[^a-zA-Z]*\s\((.*)\)\suntil\s(.*)/);  // lazy but works. IP has to be omitted.
        if (res && !ok) {
            description = `**KICK: ${res[1]} bans ${res[2]} until ${res[3]}**`;
            color = 0xf90000;
            ok = true;
        }
        
        // lag-protect message
        res = message.match(/^LAGPROTECT:\s(\S*)\s?\((\d*)\)\s*was\s*turned\s*into\s*Speck\s*due\s*to\s*LAG\!\s(.*)/);  // obst pls
        if (res && !ok) {
            description = `**LAGPROTECT:** ${res[1]} (${res[2]}) has been put into spectator mode because of lag.\n**MIN/MAX:** ${res[3]}`;
            color = 0xff7171;
            ok = true;
        }
        
        // status message
        res = message.match(/^(?:(?:1st|2nd|3rd)\sQUARTER\s)?STATU?S:\s(\d*\/\d*\splayers\s)\s?--\s(.[^--]*)(?:\s?[--]*\sTop fraggers:\s?)?(.*)?/);
        if (res && !ok) {
            description = `Mode/map: **${res[2]}**\n`;
            description += `Players: **${res[1]}**\n`;
            if(res[3] !== undefined) {
                description += `\nTop fraggers:\n\n`;
                res = res[3].match(/\-?\s?\d+\)\s[^\s]*\s\(\d*\)\s\([^ ]*\s[^\s]*\)/g);
                for (let rank of res) {
                    let res2 = rank.match(/\-?\s?(\d+)\)\s([^\s]*)\s\((\d*)\)\s\(([^\s]*\s[^\s]*)\)/);
                    if (res2) {
                        description += `**${res2[1]}**. ${res2[2]} (${res2[3]}) *(${res2[4]})*\n`;
                    }
                }
            }
            authorName = `SERVER STATUS`;
            authorURL = `https://sauertracker.net/server/108.61.175.26/28785`;
            color = 0xa54300;
            ok = true;
        }
        
        // game ended message 
        res = message.match(/^INTERMISSION:\s(\d*\/\d*\splayers\s)\s?--\s(.[^--]*)(?:\s?[--]*\sTop fraggers:\s?)?(.*)?/);
        if (res && !ok) {
            description = `Mode/map: **${res[2]}**\n`;
            description += `Players: **${res[1]}**\n`;
            if(res[3] !== undefined) {
                description += `\nTop fraggers:\n\n`;
                res = res[3].match(/\-?\s?\d+\)\s[^\s]*\s\(\d*\)\s\([^\s]*\s[^\s]*\)/g);
                for (let rank of res) {
                    let res2 = rank.match(/\-?\s?(\d+)\)\s([^\s]*)\s\((\d*)\)\s\(([^\s]*\s[^\s]*)\)/);
                    if (res2) {
                        description += `**${res2[1]}**. ${res2[2]} (${res2[3]}) *(${res2[4]})*\n`;
                    }
                }
            }
            authorName = `GAME ENDED!`;
            authorURL = `https://sauertracker.net/games/find?host=108.61.175.26&port=28785`;
            color = 0xffa700;
            ok = true;
        }
        
        // handle everything else the bot says here
        if(!ok) {
            description = `${message}`;
            color = 0x020202;
            ok = true;
        }
        
        if (!description) return;
        const channel = discordClient.channels.find('id', discordChannelID);
        const embed = { type: "rich", description, color };
        if (messageURL) embed.url = messageURL;
        if (authorName) {
            embed.author = { name: authorName };
            if (authorURL) embed.author.url = authorURL;
        }
        
        channel.send({ embed });
        ok = false;
        
    } else {
    
        // These are messages sent by other clients in the IRC-channel. Just make it look like a normal IRC-bridge.        
        const channel = discordClient.channels.find('id', discordChannelID);
        channel.send("<" + from + "> " + message);
  }
});

ircClient.addListener("error", function(message) {
    return console.log("[IRC] Error: ", message);
});

ircClient.addListener('registered', function(message) {
    return console.log("[IRC] Successfully connected to IRC.");
});

discordClient.on('ready', function() {
    console.log('[DISCORD] Successfully connected to discord.');
});

function getNick(user, guild) {
    const userDetails = guild.members.get(user.id);
    if (userDetails) {
      return userDetails.nickname || user.username;
    }
    return user.username;
}

discordClient.on('message', function(message) {
    if(message.channel.type == "text" && message.channel.id == discordChannelID) {  // Don't allow pm's ever.
        if(message.guild.member(message.author) !== message.guild.me) {
            if(message.content.match(/^\.(.*)/)){  // a command was issued
                let aliascap = message.content.match(/^\.botname(\s(\S*))?/);
                if (aliascap){
                    let description = "";
                    let color = 0x020202;
                    if (aliascap[2]) {
                        botname = aliascap[2];
                        description = "Changed Rigatoni bot name to '**" + aliascap[2] + "**'.";
                    } else {
                        description = "The Rigatoni bot name is '**" + botname + "**'.";
                    }
                    const channel = discordClient.channels.find('id', discordChannelID);
                    const embed = { type: "rich", description, color };
                    channel.send({ embed });
                } else {
                    ircClient.say(ircChannels, message.content);  // send command to IRC
                }
            } else {
                ircClient.say(ircChannels, "<" + getNick(message.author, message.guild) + ">" + " " + message.content);  // normal chat IRC-bridge
            }
        }
    }
});

discordClient.login(discordToken);
