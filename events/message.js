/* eslint-disable no-restricted-syntax */
const Discord = require('discord.js');
const guildsettingskeys = require('../guildsettings-keys.json');
const usersettingskeys = require('../usersettings-keys.json');
const botsettingskeys = require('../botsettings-keys.json');
const settings = require('../settings.json');

module.exports = {
  run: async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type !== 'text') return;
    if (!client.provider.isReady) return;

    if (settings.NODE_ENV === 'development') {
      const betaTester = client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'beta tester').members.array();
      let betaTesterAccess;

      await betaTester.forEach((member) => {
			  if (member.id === msg.guild.ownerID) betaTesterAccess = true;
	  });

      if (!betaTesterAccess) {
			  try {
          await msg.guild.owner.send('You are not a Beta Tester :(');
			  }
			  catch (error) {
          undefined;
			  }
			  return msg.guild.leave();
      }
		  }

    if (client.provider.getGuild(msg.guild.id)) { // Everything can be requested here
      const settings = client.provider.guildSettings.get(msg.guild.id);
      for (const key in guildsettingskeys) {
        if (!settings[key] && typeof settings[key] === 'undefined') {
          settings[key] = guildsettingskeys[key];
        }
      }
      await client.provider.setGuildComplete(msg.guild.id, settings);

      const currentCommands = client.provider.getGuild(msg.guild.id, 'commands');
      for (let i = 0; i < client.registry.commands.array().length; i += 1) {
        if (!client.provider.getGuild(msg.guild.id, 'commands')[client.registry.commands.array()[i].name]) {
          currentCommands[client.registry.commands.array()[i].name] = {
            name: client.registry.commands.array()[i].name,
            status: 'true',
            bannedroles: [],
            bannedchannels: [],
            cooldown: '3000',
            ifBlacklistForRoles: 'true',
            ifBlacklistForChannels: 'true',
            whitelistedroles: [],
            whitelistedchannels: []
          };
        }
        if (!currentCommands[client.registry.commands.array()[i].name].ifBlacklistForRoles) {
          currentCommands[client.registry.commands.array()[i].name].ifBlacklistForRoles = 'true';
          currentCommands[client.registry.commands.array()[i].name].ifBlacklistForChannels = 'true';
          currentCommands[client.registry.commands.array()[i].name].whitelistedroles = [];
          currentCommands[client.registry.commands.array()[i].name].whitelistedchannels = [];
        }
      }

      await msg.client.provider.setGuild(msg.guild.id, 'commands', currentCommands);
    }
    else {
      const commandsObject = {};
      for (let i = 0; i < client.registry.commands.array().length; i += 1) {
        if (!commandsObject[client.registry.commands.array()[i].name]) {
          commandsObject[client.registry.commands.array()[i].name] = {
            name: client.registry.commands.array()[i].name,
            status: 'true',
            bannedroles: [],
            bannedchannels: [],
            cooldown: '3000',
            ifBlacklistForRoles: 'true',
            ifBlacklistForChannels: 'true',
            whitelistedroles: [],
            whitelistedchannels: []
          };
        }
        if (!commandsObject[client.registry.commands.array()[i].name].ifBlacklistForRoles) {
          commandsObject[client.registry.commands.array()[i].name].ifBlacklistForRoles = 'true';
          commandsObject[client.registry.commands.array()[i].name].ifBlacklistForChannels = 'true';
          commandsObject[client.registry.commands.array()[i].name].whitelistedroles = [];
          commandsObject[client.registry.commands.array()[i].name].whitelistedchannels = [];
        }
      }
      await msg.client.provider.reloadGuild(msg.guild.id);
      await msg.client.provider.setGuild(msg.guild.id, 'commands', commandsObject);
    }

    if (client.provider.getUser(msg.author.id)) {
      const settings = client.provider.userSettings.get(msg.author.id);
      // eslint-disable-next-line guard-for-in
      for (const key in usersettingskeys) {
        if (!settings[key] && typeof settings[key] === 'undefined') {
          settings[key] = usersettingskeys[key];
        }

        if (typeof usersettingskeys[key] === 'object') {
          for (const key2 in usersettingskeys[key]) {
            if (!settings[key][key2]) {
              settings[key][key2] = usersettingskeys[key][key2];
            }
          }
        }
      }
      await msg.client.provider.setUserComplete(msg.author.id, settings);
    }
    else {
      await msg.client.provider.reloadUser(msg.author.id);
    }

    if (client.provider.getBotsettings('botconfs')) {
      const settings = client.provider.botSettings.get('botconfs');
      // eslint-disable-next-line guard-for-in
      for (const key in botsettingskeys) {
        if (!settings[key]) {
          settings[key] = botsettingskeys[key];
        }
      }
      await msg.client.provider.setBotconfsComplete('botconfs', settings);
    }
    else {
      await msg.client.provider.setBotconfsComplete('botconfs', botsettingskeys);
    }

    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../languages/${langSet}.json`);

    if (msg.client.provider.getGuild(msg.guild.id, 'modules').utility === 'true') {
      if (!msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.includes(msg.channel.id)) {
        const currentScores = client.provider.getGuild(msg.guild.id, 'scores');
        if (currentScores[msg.author.id]) {
          currentScores[msg.author.id].points += 1;
        }
        else {
          currentScores[msg.author.id] = {
            points: 0,
            level: 0
          };
        }

        const curLevel = Math.floor(0.3 * Math.sqrt(currentScores[msg.author.id].points + 1));
        if (curLevel > currentScores[msg.author.id].level) {
          currentScores[msg.author.id].level = curLevel;

          if (client.provider.getGuild(msg.guild.id, 'xpmessages') === 'true') {
            const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', currentScores[msg.author.id].level);
            msg.channel.send(levelup);
          }
        }
        if (curLevel < currentScores[msg.author.id].level) {
          currentScores[msg.author.id].level = curLevel;

          if (client.provider.getGuild(msg.guild.id, 'xpmessages') === 'true') {
            const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', currentScores[msg.author.id].level);
            msg.channel.send(levelup);
          }
        }
        await client.provider.setGuild(msg.guild.id, 'scores', currentScores);

        /* for (let i = 1; i < client.provider.getGuild(msg.guild.id, 'ara').length; i += 2) {
					if (client.provider.getGuild(msg.guild.id, 'ara').ara[i] < currentScores[msg.author.id].points && !msg.member.roles.get(client.provider.getGuild(msg.guild.id, 'ara')[i - 1])) {
						const role = msg.guild.roles.get(client.provider.getGuild(msg.guild.id, 'ara')[i - 1]);
						msg.member.roles.add(role);

						const automaticrolegotten = lang.messageevent_automaticrolegotten.replace('%rolename', role.name);
						msg.channel.send(automaticrolegotten);
					}
				} */
      }
    }

    if (!client.provider.getUser(msg.author.id, 'userID')) {
      await client.provider.setUser(msg.author.id, 'userID', msg.author.id);
    }

    // Chatfilter:
    const prefix = client.provider.getGuild(msg.guild.id, 'prefix');
    const command = msg.content.split(' ').slice(0, 1).join(' ')
      .replace(prefix, '');

    if (msg.client.provider.getGuild(msg.guild.id, 'chatfilter').chatfilter === 'true' && msg.client.provider.getGuild(msg.guild.id, 'chatfilter').array.length !== 0 && !client.registry.commands.get(command)) {
      const words = msg.client.provider.getGuild(msg.guild.id, 'chatfilter').array;
      const filtered = msg.content.toLowerCase().split(' ').filter((m) => words.includes(m));

      if (filtered.length) {
        if (msg.client.provider.getGuild(msg.guild.id, 'chatfilterlog') === 'true') {
          const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', msg.author.tag);

          const embed = new Discord.MessageEmbed()
            .addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
            .addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
            .addField(`📥 ${lang.messagereactionaddevent_message}:`, msg.cleanContent)
            .setColor('RED')
            .setAuthor(chatfilterembed);

          try {
            await msg.guild.channels.get(msg.client.provider.getGuild(msg.guild.id, 'chatfilterlogchannel')).send({
              embed
            });
          }
          catch (error) {
            return;
          }
        }
        await msg.delete();

        const messagedeleted = lang.messageevent_messagedeleted.replace('%author', msg.author);
        return msg.channel.send(messagedeleted);
      }
    }

    const currentStatsCreditsRecord = msg.client.provider.getUser(msg.author.id, 'stats');
    const currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
    if (currentStatsCreditsRecord) {
      if (currentStatsCreditsRecord.creditshighestcredits < currentCredits) {
        currentStatsCreditsRecord.creditshighestcredits = currentCredits;
        await msg.client.provider.setUser(msg.author.id, 'stats', currentStatsCreditsRecord);
      }
    }
  }
};
