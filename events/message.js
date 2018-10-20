const sql = require('sqlite');
const settings = require('../settings.json');
const guildsettingskeys = require('../guildsettings-keys.json');
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

	const userconfs = {
		inventory: {
			crate: 0,
			cratekey: 0,
			pickaxe: 0,
			joystick: 0,
			house: 0,
			bag: 0,
			diamond: 0,
			dog: 0,
			cat: 0,
			apple: 0,
			football: 0,
			car: 0,
			phone: 0,
			computer: 0,
			camera: 0,
			clock: 0,
			rose: 0,
			umbrella: 0,
			hamburger: 0,
			croissant: 0,
			basketball: 0,
			watch: 0,
			projector: 0,
			flashlight: 0,
			bed: 0,
			hammer: 0,
			book: 0,
			mag: 0,
			banana: 0,
			inventoryslotticket: 0,
			tractor: 0,
			syringe: 0,
			gun: 0,
			knife: 0
		},
		inventoryslots: 30,
		premium: {
			status: false,
			bought: [],
			end: ''
		}
	};

	if (!client.userdb.has(msg.author.id)) {
		await client.userdb.set(msg.author.id, userconfs);
	}

	if (client.guildconfs.get(msg.guild.id)) {
		const tableload = await client.guildconfs.get(msg.guild.id);
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

		await client.guildconfs.set(msg.guild.id, tableload);
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

		await client.guildconfs.set(msg.guild.id, guildsettingskeys);
	}


	const tableload = await client.guildconfs.get(msg.guild.id);
	const userdb = await client.userdb.get(msg.author.id);
	const botconfspremiumload = await client.botconfs.get('premium');
	const botconfs = await client.botconfs.get('botconfs');

	if (!botconfs.badgeEmojis) {
		botconfs.badgeEmojis = {};
		await client.botconfs.set('botconfs', botconfs);
	}

	botconfs.badgeEmojis = {
		administrator: ['🅰', 10],
		developer: ['⚒', 8],
		moderator: ['👮', 8],
		'test-moderator': ['👮', 8],
		'documentation-proofreader': ['👁', 7],
		'documentation-moderator': ['📝', 7],
		designer: ['📸', 7],
		'translation leader': ['🗣', 7],
		'translation proofreader': ['👁', 6],
		translator: ['🈚', 5],
		donator: ['❤', 6],
		bugreporter: ['🅱', 1],
		proposalwriter: ['🅿', 1],
		partner: ['☑', 7]
	};
	await client.botconfs.set('botconfs', botconfs);

	if (!botconfs.bans) {
		botconfs.bans = {};
		botconfs.banscount = 0;
		await client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.mutes) {
		botconfs.mutes = {};
		botconfs.mutescount = 0;
		await client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.commandsexecuted) {
		botconfs.commandsexecuted = 0;
		await client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.generalfaq) {
		botconfs.generalfaq = {};
		await client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.tutorials) {
		botconfs.tutorials = {};
		await client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.tickets || !botconfs.ticketid) {
		botconfs.ticketid = 0;
		botconfs.tickets = {};
		await client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfspremiumload.keys) {
		botconfspremiumload.keys = {
			numberofuserkeys: 0,
			numberofguildkeys: 0,
			redeemeduserkeys: [],
			redeemedguildkeys: []
		};
		await client.botconfs.set('premium', botconfspremiumload);
	}

	if (!userdb.socialmedia) {
		userdb.socialmedia = {
			instagram: '',
			twitter: '',
			youtube: '',
			twitch: ''
		};
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.premium) {
		userdb.premium = {
			status: false,
			bought: [],
			end: ''
		};
		await client.userdb.set(msg.author.id, userdb);
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

	if (!userdb.badges) {
		userdb.badges = [];
		await client.userdb.set(msg.author.id, userdb);
	}

	if (userdb.badges.length !== 0) {
		for (let i = 0; i < userdb.badges.length; i++) {
			if (userdb.badges[i].name === 'Birthday2018') {
				userdb.badges[i].emoji = '🎁';
			}
		}
		await client.userdb.set(msg.author.id, userdb);
	}
	/* eslint quote-props: ["error", "as-needed"]*/
	if (!userdb.lenoxbotranks) {
		userdb.lenoxbotranks = {
			administrator: false,
			developer: false,
			moderator: false,
			'test-moderator': false,
			'documentation-proofreader': false,
			'documentation-moderator': false,
			designer: false,
			'translation leader': false,
			'translation proofreader': false,
			translator: false,
			donator: false,
			bugreporter: false,
			proposalwriter: false,
			partner: false
		};
		await client.userdb.set(msg.author.id, userdb);
	}

	if (msg.guild.id === '352896116812939264') {
		/* eslint guard-for-in: 0 */
		for (const x in userdb.lenoxbotranks) {
			const role = msg.guild.roles.find(r => r.name.toLowerCase() === x.toLowerCase());
			if (!role) return console.error(`Couldn't fetch the following role ${x}`);

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
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.userID) {
		userdb.userID = msg.author.id;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.dailyremind) {
		userdb.dailyremind = false;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.math) {
		userdb.math = {
			points: 0,
			level: 0
		};
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!botconfs.dailyreminder) {
		botconfs.dailyreminder = {};
		await client.botconfs.set('botconfs', botconfs);
	}

	if (!botconfs.jobreminder) {
		botconfs.jobreminder = {};
		await client.botconfs.set('botconfs', botconfs);
	}

	if (!userdb.dailystreak) {
		userdb.dailystreak = {
			streak: 0,
			lastpick: '',
			deadline: ''
		};
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.creditsmessage) {
		userdb.creditsmessage = false;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (typeof userdb.inventory.gun !== 'number') {
		userdb.inventory.tractor = 0;
		userdb.inventory.syringe = 0;
		userdb.inventory.gun = 0;
		userdb.inventory.knife = 0;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (typeof userdb.inventory.rose !== 'number') {
		userdb.inventory.rose = 0;
		userdb.inventory.umbrella = 0;
		userdb.inventory.hamburger = 0;
		userdb.inventory.croissant = 0;
		userdb.inventory.basketball = 0;
		userdb.inventory.watch = 0;
		userdb.inventory.projector = 0;
		userdb.inventory.flashlight = 0;
		userdb.inventory.bed = 0;
		userdb.inventory.hammer = 0;
		userdb.inventory.book = 0;
		userdb.inventory.mag = 0;
		userdb.inventory.banana = 0;
		userdb.inventory.inventoryslotticket = 0;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.inventoryslots) {
		userdb.inventoryslots = 30;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.jobstatus) {
		userdb.jobstatus = false;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.inventory) {
		userdb.inventory = {
			crate: 0,
			cratekey: 0,
			pickaxe: 0,
			joystick: 0,
			house: 0,
			bag: 0,
			diamond: 0,
			dog: 0,
			cat: 0,
			apple: 0,
			football: 0,
			car: 0,
			phone: 0,
			computer: 0,
			camera: 0,
			clock: 0,
			rose: 0,
			umbrella: 0,
			hamburger: 0,
			croissant: 0,
			basketball: 0,
			watch: 0,
			projector: 0,
			flashlight: 0,
			bed: 0,
			hammer: 0,
			book: 0,
			mag: 0,
			banana: 0,
			inventoryslotticket: 0
		};
		await client.userdb.set(msg.author.id, userdb);
	}

	// CHANGE TO THE NEW CROWDIN SYSTEM
	if (tableload.language === 'en') {
		tableload.language = 'en-US';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.language === 'ge') {
		tableload.language = 'de-DE';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.language === 'fr') {
		tableload.language = 'fr-FR';
		await client.guildconfs.set(msg.guild.id, tableload);
	}
	// CHANGE TO THE NEW CROWDIN SYSTEM

	const lang = require(`../languages/${tableload.language}.json`);

	if (tableload.language === 'de') {
		tableload.language = 'ge';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	// Check if all channels still exist
	if (tableload.modlogchannel !== '' && !msg.guild.channels.get(tableload.modlogchannel)) {
		tableload.modlog = 'false';
		tableload.modlogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.messagedellogchannel !== '' && !msg.guild.channels.get(tableload.messagedellogchannel)) {
		tableload.messagedellog = 'false';
		tableload.messagedellogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.messageupdatelogchannel !== '' && !msg.guild.channels.get(tableload.messageupdatelogchannel)) {
		tableload.messageupdatelog = 'false';
		tableload.messageupdatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.channelupdatelogchannel !== '' && !msg.guild.channels.get(tableload.channelupdatelogchannel)) {
		tableload.channelupdatelog = 'false';
		tableload.channelupdatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.channelcreatelogchannel !== '' && !msg.guild.channels.get(tableload.channelcreatelogchannel)) {
		tableload.channelcreatelog = 'false';
		tableload.channelcreatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.channeldeletelogchannel !== '' && !msg.guild.channels.get(tableload.channeldeletelogchannel)) {
		tableload.channeldeletelog = 'false';
		tableload.channelcreatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.guildmemberupdatelogchannel !== '' && !msg.guild.channels.get(tableload.guildmemberupdatelogchannel)) {
		tableload.guildmemberupdatelog = 'false';
		tableload.guildmemberupdatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.presenceupdatelogchannel !== '' && !msg.guild.channels.get(tableload.presenceupdatelogchannel)) {
		tableload.presenceupdatelog = 'false';
		tableload.presenceupdatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.welcomelogchannel !== '' && !msg.guild.channels.get(tableload.welcomelogchannel)) {
		tableload.welcomelog = 'false';
		tableload.welcomelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.guildupdatelogchannel !== '' && !msg.guild.channels.get(tableload.guildupdatelogchannel)) {
		tableload.guildupdatelog = 'false';
		tableload.guildupdatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.byelogchannel !== '' && !msg.guild.channels.get(tableload.byelogchannel)) {
		tableload.byelog = 'false';
		tableload.byelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.rolecreatelogchannel !== '' && !msg.guild.channels.get(tableload.rolecreatelogchannel)) {
		tableload.rolecreatelog = 'false';
		tableload.rolecreatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.roledeletelogchannel !== '' && !msg.guild.channels.get(tableload.roledeletelogchannel)) {
		tableload.roledeletelog = 'false';
		tableload.roledeletelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.roleupdatelogchannel !== '' && !msg.guild.channels.get(tableload.roleupdatelogchannel)) {
		tableload.roleupdatelog = 'false';
		tableload.roleupdatelogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.welcomechannel !== '' && !msg.guild.channels.get(tableload.welcomechannel)) {
		tableload.welcome = 'false';
		tableload.welcomechannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.byechannel !== '' && !msg.guild.channels.get(tableload.byechannel)) {
		tableload.bye = 'false';
		tableload.byechannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.announcechannel !== '' && !msg.guild.channels.get(tableload.announcechannel)) {
		tableload.announce = 'false';
		tableload.announcechannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.votechannel !== '' && !msg.guild.channels.get(tableload.votechannel)) {
		tableload.votechannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.archivechannellog !== '' && !msg.guild.channels.get(tableload.archivechannellog)) {
		tableload.archivechannellog = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.musicchannelblacklist.length !== 0) {
		for (let i = 0; i < tableload.musicchannelblacklist.length; i++) {
			if (!msg.guild.channels.get(tableload.musicchannelblacklist[i])) {
				tableload.musicchannelblacklist.splice(i, 1);
			}
		}
		await client.guildconfs.set(msg.guild.id, tableload);
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
					return msg.channel.send({
						embed: banlistembed
					});
				}
			}
			for (let i = 0; i < botconfsload.blacklist.length; i++) {
				if (msg.author.id === botconfsload.blacklist[i].userID) {
					return msg.channel.send({
						embed: blacklistembed
					});
				}
			}

			const botconfig = client.botconfs.get('botconfs');
			const activityembed = new Discord.RichEmbed()
				.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL)
				.addField('Command', `${tableload.prefix}${command} ${args.join(' ')}`)
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
				const timestamps = await client.cooldowns.get(cmd.help.name);
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
						await client.cooldowns.set(cmd.help.name, timestamps);
					} else {
						timestamps[msg.author.id] = now;
						await client.cooldowns.set(cmd.help.name, timestamps);
					}
				} else {
					timestamps[msg.author.id] = now;
					await client.cooldowns.set(cmd.help.name, timestamps);
				}
			}

			if (botCommandExists) {
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
									.setColor('#FF0000')
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
								.setColor('#FF0000')
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