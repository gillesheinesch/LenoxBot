const sql = require('sqlite');
const settings = require('../settings.json');
const guildsettingskeys = require('../guildsettings-keys.json');
const usersettingskeys = require('../usersettings-keys.json');
guildsettingskeys.prefix = settings.prefix;
sql.open(`../${settings.sqlitefilename}.sqlite`);
const moment = require('moment');
require('moment-duration-format');
const Discord = require('discord.js');
const englishlang = require(`../languages/en-US.json`);
exports.run = async (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply(englishlang.messageevent_error);

	if (client.user.id === '353115097318555649') {
		if (msg.guild.id !== '332612123492483094') return;
	}

	if (client.guildconfs.get(msg.guild.id)) {
		const tableload = client.guildconfs.get(msg.guild.id);
		for (const key in guildsettingskeys) {
			if (!tableload[key]) {
				tableload[key] = guildsettingskeys[key];
			}
		}

		for (let i = 0; i < client.commands.array().length; i++) {
			if (!tableload.commands[client.commands.array()[i].help.name]) {
				tableload.commands[client.commands.array()[i].help.name] = {
					name: client.commands.array()[i].help.name,
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
			if (!tableload.commands[client.commands.array()[i].help.name].ifBlacklistForRoles) {
				tableload.commands[client.commands.array()[i].help.name].ifBlacklistForRoles = 'true';
				tableload.commands[client.commands.array()[i].help.name].ifBlacklistForChannels = 'true';
				tableload.commands[client.commands.array()[i].help.name].whitelistedroles = [];
				tableload.commands[client.commands.array()[i].help.name].whitelistedchannels = [];
			}
		}

		client.guildconfs.set(msg.guild.id, tableload);
	} else {
		for (let i = 0; i < client.commands.array().length; i++) {
			if (!guildsettingskeys.commands[client.commands.array()[i].help.name]) {
				guildsettingskeys.commands[client.commands.array()[i].help.name] = {
					name: client.commands.array()[i].help.name,
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
			if (!guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForRoles) {
				guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForRoles = 'true';
				guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForChannels = 'true';
				guildsettingskeys.commands[client.commands.array()[i].help.name].whitelistedroles = [];
				guildsettingskeys.commands[client.commands.array()[i].help.name].whitelistedchannels = [];
			}
		}

		client.guildconfs.set(msg.guild.id, guildsettingskeys);
	}

	if (client.userdb.get(msg.author.id)) {
		const userdb = client.userdb.get(msg.author.id);
		for (const key in usersettingskeys) {
			if (!userdb[key]) {
				userdb[key] = usersettingskeys[key];
			}

			if (typeof usersettingskeys[key] === 'object') {
				for (const key2 in usersettingskeys[key]) {
					if (!userdb[key][key2]) {
						userdb[key][key2] = usersettingskeys[key][key2];
					}
				}
			}
		}

		client.userdb.set(msg.author.id, userdb);
	} else {
		client.userdb.set(msg.author.id, usersettingskeys);
	}

	const tableload = client.guildconfs.get(msg.guild.id);
	const userdb = client.userdb.get(msg.author.id);
	const botconfspremiumload = client.botconfs.get('premium');
	const botconfs = client.botconfs.get('botconfs');

	if (!botconfs.badgeEmojis) {
		botconfs.badgeEmojis = {};
		client.botconfs.set('botconfs', botconfs);
	}

	/* eslint quote-props: ["error", "as-needed"]*/
	botconfs.badgeEmojis = {
		administrator: ['🅰', 10],
		developer: ['⚒', 8],
		moderator: ['👮', 8],
		'test-moderator': ['👮', 8],
		'documentation-proofreader': ['👁', 7],
		designer: ['📸', 7],
		'translation-leader': ['🗣', 7],
		'translation-proofreader': ['👁', 6],
		translator: ['🈚', 5],
		donator: ['❤', 6],
		bugreporter: ['🅱', 1],
		proposalwriter: ['🅿', 1],
		partner: ['☑', 7]
	};
	client.botconfs.set('botconfs', botconfs);

	if (!botconfs.bans) {
		botconfs.bans = {};
		botconfs.banscount = 0;
		client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.mutes) {
		botconfs.mutes = {};
		botconfs.mutescount = 0;
		client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.commandsexecuted) {
		botconfs.commandsexecuted = 0;
		client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.generalfaq) {
		botconfs.generalfaq = {};
		client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.tutorials) {
		botconfs.tutorials = {};
		client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.tickets) {
		botconfs.tickets = {};
		client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.ticketids) {
		botconfs.ticketids = [];
		client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfspremiumload.keys) {
		botconfspremiumload.keys = {
			numberofuserkeys: 0,
			numberofguildkeys: 0,
			redeemeduserkeys: [],
			redeemedguildkeys: [],
			guildkeys: [],
			userkeys: []
		};
		client.botconfs.set('premium', botconfspremiumload);
	}

	if (!botconfspremiumload.keys.guildkeys) {
		botconfspremiumload.keys.guildkeys = [];
		botconfspremiumload.keys.userkeys = [];
		client.botconfs.set('premium', botconfspremiumload);
	}

	sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		}
	}).catch(() => {
		sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		});
	});

	if (userdb.badges.length !== 0) {
		for (let i = 0; i < userdb.badges.length; i++) {
			if (userdb.badges[i].name === 'Birthday2018') {
				userdb.badges[i].emoji = '🎁';
			}
		}
		client.userdb.set(msg.author.id, userdb);
	}

	/* eslint guard-for-in: 0 */
	if (msg.guild.id === '352896116812939264') {
		for (const x in userdb.lenoxbotranks) {
			const role = msg.guild.roles.find(r => r.name.toLowerCase() === x.toLowerCase());
			if (role) {
				if (msg.member.roles.get(role.id)) {
					userdb.lenoxbotranks[x] = true;

					const badgeSettings = {
						name: x.toLowerCase(),
						rarity: botconfs.badgeEmojis[x][1],
						staff: false,
						date: Date.now(),
						emoji: botconfs.badgeEmojis[x][0]
					};

					let check = false;
					for (let i = 0; i < userdb.badges.length; i++) {
						if (userdb.badges[i].name.toLowerCase() === x.toLowerCase()) {
							check = true;
						}
					}
					if (!check) {
						userdb.badges.push(badgeSettings);
					}
				} else {
					userdb.lenoxbotranks[x] = false;
					for (let i = 0; i < userdb.badges.length; i++) {
						if (userdb.badges[i].name.toLowerCase() === x.toLowerCase()) {
							userdb.badges.splice(i, 1);
						}
					}
				}
			}
		}
		client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.userID) {
		userdb.userID = msg.author.id;
		client.userdb.set(msg.author.id, userdb);
	}

	if (!botconfs.dailyreminder) {
		botconfs.dailyreminder = {};
		client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.jobreminder) {
		botconfs.jobreminder = {};
		client.botconfs.set('botconfs', botconfs);
	}

	if (userdb.jobstatus === true && !botconfs.jobreminder[msg.author.id]) {
		delete botconfs.jobreminder[msg.author.id];
		userdb.jobstatus = false;
		client.botconfs.set('botconfs', botconfs);
		client.userdb.set(msg.author.id, userdb);
	}

	// CHANGE TO THE NEW CROWDIN SYSTEM
	if (tableload.language === 'en') {
		tableload.language = 'en-US';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.language === 'ge') {
		tableload.language = 'de-DE';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.language === 'fr') {
		tableload.language = 'fr-FR';
		client.guildconfs.set(msg.guild.id, tableload);
	}
	// CHANGE TO THE NEW CROWDIN SYSTEM

	const lang = require(`../languages/${tableload.language}.json`);

	if (tableload.language === 'de') {
		tableload.language = 'ge';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	// Check if all channels of the guildsettings still exist
	if (tableload.modlogchannel !== '' && !msg.guild.channels.get(tableload.modlogchannel)) {
		tableload.modlog = 'false';
		tableload.modlogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.messagedellogchannel !== '' && !msg.guild.channels.get(tableload.messagedellogchannel)) {
		tableload.messagedellog = 'false';
		tableload.messagedellogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.messageupdatelogchannel !== '' && !msg.guild.channels.get(tableload.messageupdatelogchannel)) {
		tableload.messageupdatelog = 'false';
		tableload.messageupdatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.channelupdatelogchannel !== '' && !msg.guild.channels.get(tableload.channelupdatelogchannel)) {
		tableload.channelupdatelog = 'false';
		tableload.channelupdatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.channelcreatelogchannel !== '' && !msg.guild.channels.get(tableload.channelcreatelogchannel)) {
		tableload.channelcreatelog = 'false';
		tableload.channelcreatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.channeldeletelogchannel !== '' && !msg.guild.channels.get(tableload.channeldeletelogchannel)) {
		tableload.channeldeletelog = 'false';
		tableload.channelcreatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.guildmemberupdatelogchannel !== '' && !msg.guild.channels.get(tableload.guildmemberupdatelogchannel)) {
		tableload.guildmemberupdatelog = 'false';
		tableload.guildmemberupdatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.presenceupdatelogchannel !== '' && !msg.guild.channels.get(tableload.presenceupdatelogchannel)) {
		tableload.presenceupdatelog = 'false';
		tableload.presenceupdatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.welcomelogchannel !== '' && !msg.guild.channels.get(tableload.welcomelogchannel)) {
		tableload.welcomelog = 'false';
		tableload.welcomelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.guildupdatelogchannel !== '' && !msg.guild.channels.get(tableload.guildupdatelogchannel)) {
		tableload.guildupdatelog = 'false';
		tableload.guildupdatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.byelogchannel !== '' && !msg.guild.channels.get(tableload.byelogchannel)) {
		tableload.byelog = 'false';
		tableload.byelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.rolecreatelogchannel !== '' && !msg.guild.channels.get(tableload.rolecreatelogchannel)) {
		tableload.rolecreatelog = 'false';
		tableload.rolecreatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.roledeletelogchannel !== '' && !msg.guild.channels.get(tableload.roledeletelogchannel)) {
		tableload.roledeletelog = 'false';
		tableload.roledeletelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.roleupdatelogchannel !== '' && !msg.guild.channels.get(tableload.roleupdatelogchannel)) {
		tableload.roleupdatelog = 'false';
		tableload.roleupdatelogchannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.welcomechannel !== '' && !msg.guild.channels.get(tableload.welcomechannel)) {
		tableload.welcome = 'false';
		tableload.welcomechannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.byechannel !== '' && !msg.guild.channels.get(tableload.byechannel)) {
		tableload.bye = 'false';
		tableload.byechannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.announcechannel !== '' && !msg.guild.channels.get(tableload.announcechannel)) {
		tableload.announce = 'false';
		tableload.announcechannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.votechannel !== '' && !msg.guild.channels.get(tableload.votechannel)) {
		tableload.votechannel = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.archivechannellog !== '' && !msg.guild.channels.get(tableload.archivechannellog)) {
		tableload.archivechannellog = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.musicchannelblacklist.length !== 0) {
		for (let i = 0; i < tableload.musicchannelblacklist.length; i++) {
			if (!msg.guild.channels.get(tableload.musicchannelblacklist[i])) {
				tableload.musicchannelblacklist.splice(i, 1);
			}
		}
		client.guildconfs.set(msg.guild.id, tableload);
	}
	//

	if (tableload.modules.utility === 'true') {
		if (!tableload.togglexp.channelids.includes(msg.channel.id)) {
			sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${msg.author.id}"`).then(row => {
				if (row) {
					const curLevel = Math.floor(0.3 * Math.sqrt(row.points + 1));
					if (curLevel > row.level) {
						row.level = curLevel;
						sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);

						if (tableload.xpmessages === 'true') {
							const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', row.level);
							msg.channel.send(levelup);
						}
					}
					if (curLevel < row.level) {
						row.level = curLevel;
						sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);

						if (tableload.xpmessages === 'true') {
							const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', row.level);
							msg.channel.send(levelup);
						}
					}
					sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId = "${msg.author.id}"`).then(row2 => {
						for (let i = 1; i < tableload.ara.length; i += 2) {
							if (tableload.ara[i] < row2.points && !msg.member.roles.get(tableload.ara[i - 1])) {
								const role = msg.guild.roles.get(tableload.ara[i - 1]);
								msg.member.addRole(role);

								const automaticrolegotten = lang.messageevent_automaticrolegotten.replace('%rolename', role.name);
								msg.channel.send(automaticrolegotten);
							}
						}
					});
					sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);

					const badgesScores = [1000, 10000, 100000, 1000000, 10000000];
					const badgesScoresStatus = [false, false, false, false, false];
					for (let index = 0; index < userdb.badges.length; index++) {
						for (let i = 0; i < badgesScores.length; i++) {
							if (userdb.badges[index].name.toLowerCase() === `${badgesScores[i]}xp`) {
								badgesScoresStatus[i] = true;
							}
						}
					}

					for (let i = 0; i < badgesScores.length; i++) {
						if (row.points >= badgesScores[i] && !badgesScoresStatus[i]) {
							const badgeSettings = {
								name: `${badgesScores[i]}xp`,
								rarity: 1,
								staff: false,
								date: Date.now(),
								emoji: '📈'
							};
							userdb.badges.push(badgeSettings);
							if (tableload.xpmessages === 'true') {
								const earnednewbadge = lang.messageevent_earnednewbadge.replace('%badgename', badgeSettings.name);
								msg.author.send(earnednewbadge);
							}
						}
					}
					client.userdb.set(msg.author.id, userdb);
				} else {
					sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, msg.author.id, 1, 0]);
				}
			}).catch(() => {
				sql.run('CREATE TABLE IF NOT EXISTS scores (guildid TEXT, userId TEXT, points INTEGER, level INTEGER)').then(() => {
					sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, msg.author.id, 1, 0]);
				});
			});
		}
	}

	if (msg.content.startsWith(tableload.prefix)) {
		const args = msg.content.split(' ').slice(1);
		const command = msg.content.split(' ')[0].slice(tableload.prefix.length).toLowerCase();
		let cmd;
		let customcommand;

		let customcommandstatus = false;
		for (let index = 0; index < tableload.customcommands.length; index++) {
			if (tableload.customcommands[index].name === command) {
				customcommandstatus = true;
				customcommand = tableload.customcommands[index];
			}
		}

		let botCommandExists = false;
		if (client.commands.has(command)) {
			botCommandExists = true;
			cmd = client.commands.get(command);
		} else if (client.aliases.has(command)) {
			botCommandExists = true;
			cmd = client.commands.get(client.aliases.get(command));
		} else if (customcommandstatus && customcommand.enabled) {
			cmd = customcommand;
		}

		if (cmd) {
			const banlistembed = new Discord.RichEmbed()
				.setColor('#FF0000')
				.setDescription(lang.messageevent_banlist)
				.addField(lang.messageevent_support, 'https://lenoxbot.com/discord')
				.addField(lang.messageevent_banappeal, 'https://lenoxbot.com/ban')
				.setAuthor(`${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL);

			const blacklistembed = new Discord.RichEmbed()
				.setColor('#FF0000')
				.setDescription(lang.messageevent_blacklist)
				.addField(lang.messageevent_support, 'https://lenoxbot.com/discord')
				.addField(lang.messageevent_banappeal, 'https://lenoxbot.com/ban')
				.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL);

			const botconfsload = client.botconfs.get('blackbanlist');
			for (let i = 0; i < botconfsload.banlist.length; i++) {
				if (msg.guild.id === botconfsload.banlist[i].discordServerID) {
					banlistembed.addField(lang.messageevent_banlistreason, botconfsload.banlist[i].reason);
					return msg.channel.send({
						embed: banlistembed
					});
				}
			}
			for (let i = 0; i < botconfsload.blacklist.length; i++) {
				if (msg.author.id === botconfsload.blacklist[i].userID) {
					blacklistembed.addField(lang.messageevent_blacklistreason, botconfsload.blacklist[i].reason);
					return msg.channel.send({
						embed: blacklistembed
					});
				}
			}

			const botconfig = client.botconfs.get('botconfs');
			const activityembed = new Discord.RichEmbed()
				.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL)
				.addField('Command', `${tableload.prefix}${command} ${args.join(' ').substring(0, 980)}`)
				.addField('Guild', `${msg.guild.name} (${msg.guild.id})`)
				.addField('Channel', `${msg.channel.name} (${msg.channel.id})`)
				.setColor('#ff99ff')
				.setTimestamp();
			if (botconfig.activity === true) {
				const messagechannel = client.channels.get(botconfig.activitychannel);
				messagechannel.send({
					embed: activityembed
				});
			}

			if (botCommandExists) {
				const botnopermission = lang.messageevent_botnopermission.replace('%missingpermissions', cmd.help.botpermissions.join(', '));
				const usernopermission = lang.messageevent_usernopermission.replace('%missingpermissions', cmd.conf.userpermissions.join(', '));
				if (cmd.help.botpermissions.every(perm => msg.guild.me.hasPermission(perm)) === false) {
					if (tableload.commanddel === 'true') {
						msg.delete();
					}
					return msg.channel.send(botnopermission);
				}

				if (tableload.commands[cmd.help.name].whitelistedroles.length === 0 && cmd.conf.userpermissions.every(perm => msg.member.hasPermission(perm)) === false) {
					if (tableload.commanddel === 'true') {
						msg.delete();
					}
					return msg.channel.send(usernopermission);
				}
			}

			if (botCommandExists) {
				for (const prop in tableload.modules) {
					if (prop === cmd.help.category) {
						if (tableload.modules[prop] === 'false') {
							const moduledeactivated = lang.messageevent_moduledeactivated.replace('%modulename', prop).replace('%prefix', tableload.prefix);
							if (tableload.commanddel === 'true') {
								msg.delete();
							}
							return msg.channel.send(moduledeactivated);
						}
					}
				}
			}

			if (botCommandExists) {
				if (tableload.commands[cmd.help.name].status === 'false') return msg.reply(lang.messageevent_commanddeactivated);
			} else if (customcommand.enabled === 'false') {
				return msg.reply(lang.messageevent_commanddeactivated);
			}

			if (botCommandExists) {
				if (tableload.commands[cmd.help.name].bannedchannels.includes(msg.channel.id)) return msg.reply(lang.messageevent_bannedchannel);
				if (tableload.commands[cmd.help.name].whitelistedroles.length === 0) {
					for (let index = 0; index < tableload.commands[cmd.help.name].bannedroles.length; index++) {
						if (msg.member.roles.has(tableload.commands[cmd.help.name].bannedroles[index])) return msg.reply(lang.messageevent_bannedrole);
					}
				} else {
					let allwhitelistedrolesoftheuser = 0;
					for (let index2 = 0; index2 < tableload.commands[cmd.help.name].whitelistedroles.length; index2++) {
						if (!msg.member.roles.has(tableload.commands[cmd.help.name].whitelistedroles[index2])) {
							allwhitelistedrolesoftheuser += 1;
						}
					}
					if (allwhitelistedrolesoftheuser === tableload.commands[cmd.help.name].whitelistedroles.length) {
						return msg.reply(lang.messageevent_nowhitelistedroles);
					}
				}

				if (!client.cooldowns.has(cmd.help.name)) {
					client.cooldowns.set(cmd.help.name, {});
				}

				const now = Date.now();
				const timestamps = client.cooldowns.get(cmd.help.name);
				let cooldownAmount;
				if (tableload.commands[cmd.help.name]) {
					cooldownAmount = cmd.conf.cooldown || Number(tableload.commands[cmd.help.name].cooldown);
				} else {
					cooldownAmount = cmd.conf.cooldown || 3 * 1000;
				}

				if (timestamps[msg.author.id]) {
					const expirationTime = timestamps[msg.author.id] + cooldownAmount;

					if (now < expirationTime) {
						const timeLeft = (expirationTime - now) / 1000;

						const time = moment.duration(parseInt(timeLeft.toFixed(2), 10), 'seconds').format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`);
						const anticommandspam = lang.messageevent_anticommandspam.replace('%time', time).replace('%commandname', `\`${tableload.prefix}${cmd.help.name}\``);
						if (tableload.commanddel === 'true') {
							msg.delete();
						}
						return msg.reply(anticommandspam);
						/* eslint no-else-return:0 */
					} else if (now > expirationTime) {
						timestamps[msg.author.id] = now;
						client.cooldowns.set(cmd.help.name, timestamps);
					} else {
						timestamps[msg.author.id] = now;
						client.cooldowns.set(cmd.help.name, timestamps);
					}
				} else {
					timestamps[msg.author.id] = now;
					client.cooldowns.set(cmd.help.name, timestamps);
				}
			}

			if (botCommandExists) {
				if (cmd.help.name === 'loot' || cmd.help.name === 'shop') return msg.reply('This command is currently deactivated! You can find more information here: https://status.lenoxbot.com/')
				cmd.run(client, msg, args, lang);
			} else if (customcommand.embed === 'false') {
				msg.channel.send(customcommand.commandanswer);
			} else {
				const customCommandEmbed = new Discord.RichEmbed()
					.setColor('#33cc33')
					.setDescription(customcommand.commandanswer);

				msg.channel.send({
					embed: customCommandEmbed
				});
			}

			botconfs.commandsexecuted += 1;
			client.botconfs.set('botconfs', botconfs);

			if (tableload.commanddel === 'true') {
				msg.delete();
			}
		} else {
			const input = msg.content.split(' ').slice();
			if (tableload.chatfilter.chatfilter === 'true' && tableload.chatfilter.array.length !== 0) {
				for (let i = 0; i < tableload.chatfilter.array.length; i++) {
					for (let index = 0; index < input.length; index++) {
						if (input[index].toLowerCase() === tableload.chatfilter.array[i].toLowerCase()) {
							if (tableload.chatfilterlog === 'true') {
								const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', msg.author.tag);

								const embed = new Discord.RichEmbed()
									.addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
									.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
									.addField(`📥 ${lang.messagereactionaddevent_message}:`, msg.cleanContent)
									.setColor('RED')
									.setAuthor(chatfilterembed);

								try {
									await msg.guild.channels.get(tableload.chatfilterlogchannel).send({
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
		}
	} else {
		const input = msg.content.split(' ').slice();
		if (tableload.chatfilter.chatfilter === 'true' && tableload.chatfilter.array.length !== 0) {
			for (let i = 0; i < tableload.chatfilter.array.length; i++) {
				for (let index = 0; index < input.length; index++) {
					if (input[index].toLowerCase() === tableload.chatfilter.array[i].toLowerCase()) {
						if (tableload.chatfilterlog === 'true') {
							const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', msg.author.tag);

							const embed = new Discord.RichEmbed()
								.addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
								.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
								.addField(`📥 ${lang.messagereactionaddevent_message}:`, msg.cleanContent)
								.setColor('RED')
								.setAuthor(chatfilterembed);

							try {
								await msg.guild.channels.get(tableload.chatfilterlogchannel).send({
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
	}
};
