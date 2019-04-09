const englishLang = require(`../languages/en-US.json`);
const guildsettingskeys = require('../guildsettings-keys.json');
const usersettingskeys = require('../usersettings-keys.json');
const botsettingskeys = require('../botsettings-keys.json');
const Discord = require('discord.js');
exports.run = async (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply(englishLang.messageevent_error);
	if (!client.provider.isReady) return;

	if (client.provider.getGuild(msg.guild.id, 'language')) { // Everything can be requested here
		const settings = client.provider.guildSettings.get(msg.guild.id);
		for (const key in guildsettingskeys) {
			if (!settings[key] && typeof settings[key] === 'undefined') {
				console.log(settings);
				console.log(settings[key]);
				settings[key] = guildsettingskeys[key];
			}
		}
		await client.provider.setGuildComplete(msg.guild.id, settings);

		const currentCommands = client.provider.getGuild(msg.guild.id, 'commands');
		for (let i = 0; i < client.registry.commands.array().length; i++) {
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
	} else {
		for (let i = 0; i < client.registry.commands.array().length; i++) {
			if (!guildsettingskeys.commands[client.registry.commands.array()[i].name]) {
				guildsettingskeys.commands[client.registry.commands.array()[i].name] = {
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
			if (!guildsettingskeys.commands[client.registry.commands.array()[i].name].ifBlacklistForRoles) {
				guildsettingskeys.commands[client.registry.commands.array()[i].name].ifBlacklistForRoles = 'true';
				guildsettingskeys.commands[client.registry.commands.array()[i].name].ifBlacklistForChannels = 'true';
				guildsettingskeys.commands[client.registry.commands.array()[i].name].whitelistedroles = [];
				guildsettingskeys.commands[client.registry.commands.array()[i].name].whitelistedchannels = [];
			}
		}

		await msg.client.provider.setGuildComplete(msg.guild.id, guildsettingskeys);
	}

	if (client.provider.getUser(msg.author.id, 'credits')) {
		// eslint-disable-next-line guard-for-in
		for (const key in usersettingskeys) {
			if (!client.provider.getUser(msg.author.id, key)) {
				await client.provider.setUser(msg.author.id, key, usersettingskeys[key]);
			}

			if (typeof usersettingskeys[key] === 'object') {
				for (const key2 in usersettingskeys[key]) {
					if (!client.provider.getUser(msg.author.id, key[key2])) {
						await client.provider.setUser(msg.author.id, key[key2], usersettingskeys[key][key2]);
					}
				}
			}
		}
	} else {
		await msg.client.provider.setUserComplete(msg.author.id, usersettingskeys);
	}

	if (client.provider.getBotsettings('botconfs', 'premium')) {
		// eslint-disable-next-line guard-for-in
		for (const key in botsettingskeys) {
			if (!client.provider.getBotsettings('botconfs', key)) {
				await client.provider.setBotsettings('botconfs', key, botsettingskeys[key]);
			}
		}
	}

	const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
	const lang = require(`../languages/${langSet}.json`);

	if (msg.client.provider.getGuild(msg.guild.id, 'modules').utility === 'true') {
		if (!msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.includes(msg.channel.id)) {
			const currentScores = client.provider.getGuild(msg.guild.id, 'scores');
			if (currentScores[msg.author.id]) {
				currentScores[msg.author.id].points += 1;
			} else {
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
					const role = msg.message.guild.roles.get(client.provider.getGuild(msg.guild.id, 'ara')[i - 1]);
					msg.member.addRole(role);

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
	const input = msg.content.split(' ').slice();
	if (msg.client.provider.getGuild(msg.guild.id, 'chatfilter').chatfilter === 'true' && msg.client.provider.getGuild(msg.guild.id, 'chatfilter').array.length !== 0) {
		for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'chatfilter').array.length; i++) {
			for (let index = 0; index < input.length; index++) {
				if (input[index].toLowerCase() === msg.client.provider.getGuild(msg.guild.id, 'chatfilter').array[i].toLowerCase()) {
					if (msg.client.provider.getGuild(msg.guild.id, 'chatfilterlog') === 'true') {
						const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', msg.author.tag);

						const embed = new Discord.RichEmbed()
							.addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
							.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
							.addField(`📥 ${lang.messagereactionaddevent_message}:`, msg.cleanContent)
							.setColor('RED')
							.setAuthor(chatfilterembed);

						try {
							await msg.guild.channels.get(msg.client.provider.getGuild(msg.guild.id, 'chatfilterlogchannel')).send({
								embed
							});
						} catch (error) {
							return;
						}
					}
					await msg.delete();

					const messagedeleted = lang.messageevent_messagedeleted.replace('%author', msg.author);
					msg.channel.send(messagedeleted);
				}
			}
		}
	}
};
