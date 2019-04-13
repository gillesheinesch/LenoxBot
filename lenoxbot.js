const Commando = require('discord.js-commando');
const fs = require('fs');
const LenoxBotSettingsProvider = require('./utils/SettingsProvider');
const settings = require('./settings.json');
const path = require('path');
const chalk = require('chalk');
const englishlang = require(`./languages/en-US.json`);
const Discord = require('discord.js');
const NewsAPI = require('newsapi');
const moment = require('moment');
require('moment-duration-format');

if (process.env.SHARD_COUNT) {
	// const shardId = process.env.SHARD_COUNT;
	const token = process.env.CLIENT_TOKEN;


	if (!settings.token || settings.token === '' || !settings.prefix || settings.prefix === '' || !settings.sqlitefilename || settings.sqlitefilename === '' || !settings.owners || settings.owners.length === 0 || !settings.keychannel || settings.keychannel === '' || !settings.websiteport || isNaN(settings.websiteport)) {
		console.error(chalk.red('\nsettings.json file is not correctly configuered!\n'));
		return process.exit(42);
	}


	const client = new Commando.Client({
		commandPrefix: '?',
		invite: 'discord.gg/jmZZQja',
		unknownCommandResponse: false,
		nonCommandEditable: false
	});

	client.queue = new Map();
	client.skipvote = new Map();
	client.newsapi = new NewsAPI('351893454fd1480ea4fe2f0eac0307c2');

	fs.readdir('./events/', (err, files) => {
		if (err) return console.error(err);
		files.forEach(file => {
			const eventFunction = require(`./events/${file}`);
			const eventName = file.split('.')[0];
			client.on(eventName, (...args) => eventFunction.run(client, ...args));
		});
	});

	client.setProvider(new LenoxBotSettingsProvider(settings));
	client.login(token);

	client.registry
		.registerDefaultTypes()
		.registerGroups([
			['administration', 'Administration'],
			['application', 'Application'],
			['botowner', 'Bot Owner only'],
			['currency', 'Currency'],
			['customcommands', 'CustomCommands'],
			['fun', 'Fun'],
			['help', 'Help'],
			['moderation', 'Moderation'],
			['music', 'Music'],
			['nsfw', 'NSFW'],
			['partner', 'Partner'],
			['searches', 'Searches'],
			['staff', 'Staff'],
			['tickets', 'Tickets'],
			['utility', 'Utility']
		])
		.registerCommandsIn(path.join(__dirname, 'commands'));


	client.dispatcher.addInhibitor(msg => {
		if (msg.channel.type !== 'text') {
			msg.reply(englishlang.messageevent_error);
			return 'Not a text channel';
		}
		if (!client.provider.isReady) return 'notinitialized';

		if (client.user.id === '353115097318555649') {
			if (msg.message.guild.id !== '332612123492483094') return 'This is not the Test LenoxBot Server';
		}

		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`./languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');

		const args = msg.content.split(' ').slice(1);
		const command = msg.content.split(' ')[0].slice(prefix.length).toLowerCase();
		let cmd;
		let customcommand;

		let customcommandstatus = false;
		for (let index = 0; index < msg.client.provider.getGuild(msg.message.guild.id, 'customcommands').length; index++) {
			if (msg.client.provider.getGuild(msg.message.guild.id, 'customcommands')[index].name === command) {
				customcommandstatus = true;
				customcommand = msg.client.provider.getGuild(msg.message.guild.id, 'customcommands')[index];
			}
		}

		let alias = false;
		let aliasCommand;
		for (let key = 0; key < msg.client.registry.commands.array().length; key++) {
			if (msg.client.registry.commands.array()[key].aliases.includes(command)) {
				alias = true;
				aliasCommand = msg.client.registry.commands.array()[key];
			}
		}

		let botCommandExists = false;
		if (client.registry.commands.has(command)) {
			botCommandExists = true;
			cmd = client.registry.commands.get(command);
		} else if (alias === true) {
			botCommandExists = true;
			cmd = aliasCommand;
		} else if (customcommandstatus && customcommand.enabled) {
			cmd = customcommand;
		} else {
			return 'No command';
		}

		const banlistembed = new Discord.RichEmbed()
			.setColor('#FF0000')
			.setDescription(lang.messageevent_banlist)
			.addField(lang.messageevent_support, 'https://lenoxbot.com/discord')
			.addField(lang.messageevent_banappeal, 'https://lenoxbot.com/ban')
			.setAuthor(`${msg.message.guild.name} (${msg.message.guild.id})`, msg.message.guild.iconURL);

		const blacklistembed = new Discord.RichEmbed()
			.setColor('#FF0000')
			.setDescription(lang.messageevent_blacklist)
			.addField(lang.messageevent_support, 'https://lenoxbot.com/discord')
			.addField(lang.messageevent_banappeal, 'https://lenoxbot.com/ban')
			.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL);


		const blackbanlist = client.provider.getBotsettings('botconfs', 'blacklist');
		const banlist = client.provider.getBotsettings('botconfs', 'banlist');
		if (banlist.length !== 0) {
			for (let i = 0; i < banlist.length; i++) {
				if (msg.message.guild.id === banlist[i].discordServerID) {
					banlistembed.addField(lang.messageevent_banlistreason, banlist[i].reason);
					msg.channel.send({
						embed: banlistembed
					});
					return 'Banlisted';
				}
			}
		}
		if (blackbanlist.length !== 0) {
			for (let i = 0; i < blackbanlist.length; i++) {
				if (msg.author.id === blackbanlist[i].userID) {
					blacklistembed.addField(lang.messageevent_blacklistreason, blackbanlist[i].reason);
					msg.channel.send({
						embed: blacklistembed
					});
					return 'Blacklisted';
				}
			}
		}

		const activityembed = new Discord.RichEmbed()
			.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL)
			.addField('Command', `${prefix}${command} ${args.join(' ').substring(0, 980)}`)
			.addField('Guild', `${msg.message.guild.name} (${msg.message.guild.id})`)
			.addField('Channel', `${msg.channel.name} (${msg.channel.id})`)
			.setColor('#ff99ff')
			.setTimestamp();
		if (client.provider.getBotsettings('botconfs', 'activity') === true) {
			const messagechannel = client.channels.get(client.provider.getBotsettings('botconfs', 'activitychannel'));
			messagechannel.send({
				embed: activityembed
			});
		}

		if (botCommandExists) {
			const botnopermission = lang.messageevent_botnopermission.replace('%missingpermissions', cmd.clientpermissions.join(', '));
			const usernopermission = lang.messageevent_usernopermission.replace('%missingpermissions', cmd.userpermissions.join(', '));

			if (cmd.clientpermissions.every(perm => msg.message.guild.me.hasPermission(perm)) === false) {
				console.log(msg.message.guild.id, cmd.name);
				if (msg.client.provider.getGuild(msg.message.guild.id, 'commanddel') === 'true') {
					msg.delete();
				}
				msg.channel.send(botnopermission);
				return 'NoPermission';
			}

			if (msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].whitelistedroles.length === 0 && cmd.userpermissions.every(perm => msg.member.hasPermission(perm)) === false) {
				if (msg.client.provider.getGuild(msg.message.guild.id, 'commanddel') === 'true') {
					msg.delete();
				}
				msg.channel.send(usernopermission);
				return 'NoPermission';
			}

			for (const prop in msg.client.provider.getGuild(msg.message.guild.id, 'modules')) {
				if (prop === cmd.groupID) {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'modules')[prop] === 'false') {
						const moduledeactivated = lang.messageevent_moduledeactivated.replace('%modulename', prop).replace('%prefix', prefix);
						if (msg.client.provider.getGuild(msg.message.guild.id, 'commanddel') === 'true') {
							msg.delete();
						}
						msg.channel.send(moduledeactivated);
						return 'Module not activated!';
					}
				}
			}
		}

		if (botCommandExists) {
			if (msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].status === 'false') {
				msg.reply(lang.messageevent_commanddeactivated);
				return 'command deactivated';
			}
		} else if (customcommand.enabled === 'false') {
			msg.reply(lang.messageevent_commanddeactivated);
			return 'customcommand deactivated';
		}

		if (botCommandExists) {
			if (msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].bannedchannels.includes(msg.channel.id)) {
				msg.reply(lang.messageevent_bannedchannel);
				return 'banned channel';
			}

			if (msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].whitelistedroles.length === 0) {
				for (let index = 0; index < msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].bannedroles.length; index++) {
					if (msg.member.roles.has(msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].bannedroles[index])) {
						msg.reply(lang.messageevent_bannedrole);
						return 'Banned role';
					}
				}
			} else {
				let allwhitelistedrolesoftheuser = 0;
				for (let index2 = 0; index2 < msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].whitelistedroles.length; index2++) {
					if (!msg.member.roles.has(msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].whitelistedroles[index2])) {
						allwhitelistedrolesoftheuser += 1;
					}
				}
				if (allwhitelistedrolesoftheuser === msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].whitelistedroles.length) {
					msg.reply(lang.messageevent_nowhitelistedroles);
					return 'Not whitelisted role';
				}
			}

			if (!msg.client.provider.getBotsettings('botconfs', 'cooldowns')[cmd.name]) {
				const currentCooldowns = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
				currentCooldowns[cmd.name] = {};
				msg.client.provider.setBotsettings('botconfs', 'cooldowns', currentCooldowns);
			}

			const now = Date.now();
			const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
			let cooldownAmount;
			if (msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name]) {
				cooldownAmount = cmd.cooldown || Number(msg.client.provider.getGuild(msg.message.guild.id, 'commands')[cmd.name].cooldown);
			} else {
				cooldownAmount = cmd.cooldown || 3 * 1000;
			}


			if (timestamps[cmd.name][msg.author.id]) {
				const expirationTime = timestamps[cmd.name][msg.author.id] + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;

					const time = moment.duration(parseInt(timeLeft.toFixed(2), 10), 'seconds').format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`);
					const anticommandspam = lang.messageevent_anticommandspam.replace('%time', time).replace('%commandname', `\`${prefix}${cmd.name}\``);
					if (msg.client.provider.getGuild(msg.message.guild.id, 'commanddel') === 'true') {
						msg.delete();
					}
					msg.reply(anticommandspam);
					return 'Antispam';
				/* eslint no-else-return:0 */
				} else if (now > expirationTime) {
					timestamps[cmd.name][msg.author.id] = now;
					 msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
				} else {
					timestamps[cmd.name][msg.author.id] = now;
					 msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
				}
			} else {
				timestamps[cmd.name][msg.author.id] = now;
				 msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
			}
		}

		if (!botCommandExists) {
			if (customcommand.embed === 'false') {
				msg.channel.send(customcommand.commandanswer);
				return 'custom command answer send';
			} else {
				const customCommandEmbed = new Discord.RichEmbed()
					.setColor('#33cc33')
					.setDescription(customcommand.commandanswer);

				msg.channel.send({
					embed: customCommandEmbed
				});
				return 'custom command answer send (embed)';
			}
		}

		let currentCommandsexecuted = msg.client.provider.getBotsettings('botconfs', 'commandsexecuted');
		currentCommandsexecuted += 1;
		 msg.client.provider.setBotsettings('botconfs', 'commandsexecuted', currentCommandsexecuted);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'commanddel') === 'true') {
			msg.delete();
		}
	});
} else {
	console.log(chalk.red('Stopped process because the bot isn\'t running as a shard! Please start lenoxbotlauncher.js to support sharding.'));
	process.exit(0);
}
