const sql = require('sqlite');
sql.open('../lenoxbotscore.sqlite');
const moment = require('moment');
require('moment-duration-format');
const Discord = require('discord.js');
exports.run = async (client, msg) => {
	if (msg.author.bot) return;
	const englishlang = require(`../languages/en-US.json`);
	if (msg.channel.type !== 'text') return msg.reply(englishlang.messageevent_error);

	if (client.user.id === '353115097318555649') {
		if (msg.guild.id !== '332612123492483094') return;
	}

	const settings = require('../settings.json');

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

	const guildsettings = {
		prefix: settings.prefix,
		modlog: 'false',
		modlogchannel: '',
		messagedellog: 'false',
		messagedellogchannel: '',
		messageupdatelog: 'false',
		messageupdatelogchannel: '',
		channelupdatelog: 'false',
		channelupdatelogchannel: '',
		channelcreatelog: 'false',
		channelcreatelogchannel: '',
		channeldeletelog: 'false',
		channeldeletelogchannel: '',
		guildmemberupdatelog: 'false',
		guildmemberupdatelogchannel: '',
		presenceupdatelog: 'false',
		presenceupdatelogchannel: '',
		welcomelog: 'false',
		welcomelogchannel: '',
		guildupdatelog: '',
		guildupdatelogchannel: '',
		byelog: 'false',
		byelogchannel: '',
		rolecreatelog: 'false',
		rolecreatelogchannel: '',
		roledeletelog: 'false',
		roledeletelogchannel: '',
		roleupdatelog: 'false',
		roleupdatelogchannel: '',
		welcome: 'false',
		welcomechannel: '',
		welcomemsg: '',
		bye: 'false',
		byechannel: '',
		byemsg: '',
		commanddel: 'false',
		announce: 'false',
		announcechannel: '',
		selfassignableroles: [],
		minigames: 'false',
		modules: {
			fun: 'true',
			help: 'true',
			moderation: 'true',
			music: 'true',
			nsfw: 'true',
			searches: 'true',
			utility: 'true',
			application: 'true'
		},
		application: {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: '',
			status: 'false'
		},
		nicknamelog: [],
		warnlog: [],
		language: 'en-US'
	};

	if (!client.userdb.has(msg.author.id)) {
		await client.userdb.set(msg.author.id, userconfs);
	}

	if (!client.guildconfs.has(msg.guild.id)) {
		await client.guildconfs.set(msg.guild.id, guildsettings);
	}

	const tableload = await client.guildconfs.get(msg.guild.id);
	const userdb = await client.userdb.get(msg.author.id);
	const botconfspremiumload = await client.botconfs.get('premium');
	const botconfs = await client.botconfs.get('botconfs');

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

	if (!userdb.premium) {
		userdb.premium = {
			status: false,
			bought: [],
			end: ''
		};
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!tableload.premium) {
		tableload.premium = {
			status: false,
			bought: [],
			end: ''
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		}
	}).catch(error => {
		console.error(error);
		sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		});
	});

	if (!userdb.badges) {
		userdb.badges = [];
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!userdb.userID) {
		userdb.userID = msg.author.id;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (!tableload.modules.customcommands) {
		tableload.modules.customcommands = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.modules.tickets) {
		tableload.modules.tickets = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!userdb.dailyremind) {
		userdb.dailyremind = false;
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

	for (let i = 0; i < client.commands.array().length; i++) {
		if (!tableload.commands) tableload.commands = {};
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

	if (!tableload.customcommands) {
		tableload.customcommands = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.playlist) {
		tableload.playlist = {};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.application.applications || !tableload.application.applicationid) {
		tableload.application.applicationid = 0;
		tableload.application.applications = {};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.application.acceptedmessage) {
		tableload.application.acceptedmessage = '';
		tableload.application.rejectedmessage = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.tickets) {
		tableload.tickets = {
			notificationstatus: false,
			notficationchannel: ''
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.globallogs) {
		tableload.globallogs = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.modules.currency) {
		tableload.modules.currency = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
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

	if (!tableload.muteanonymous) {
		tableload.muteanonymous = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.tempbananonymous) {
		tableload.tempbananonymous = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.dashboardpermissionroles) {
		tableload.dashboardpermissionroles = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.dashboardticketpermissions) {
		tableload.dashboardticketpermissions = 6;
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.dashboardapplicationpermissions) {
		tableload.dashboardapplicationpermissions = 6;
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.application.notificationstatus) {
		tableload.application.notificationstatus = false;
		tableload.application.notificationchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.togglexp) {
		tableload.togglexp = {
			channelids: []
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.application.denyrole) {
		tableload.application.denyrole = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.modules.tickets) {
		tableload.modules.tickets = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.xpmessages) {
		tableload.xpmessages = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.musicchannelblacklist) {
		tableload.musicchannelblacklist = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.chatfilterlog) {
		tableload.chatfilterlog = 'false';
		tableload.chatfilterlogchannel = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.chatfilter) {
		tableload.chatfilter = {
			chatfilter: 'false',
			array: []
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.application.status) {
		tableload.application.status = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	const lang = require(`../languages/${tableload.language}.json`);

	if (!tableload.language) {
		tableload.language = `en-US`;
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.language === '') {
		tableload.language = 'en-US';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	// CHANGE TO THE NEW CROWDIN SYSTEM
	if (tableload.language === 'en-US') {
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

	if (!tableload.nicknamelog) {
		tableload.nicknamelog = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.warnlog) {
		tableload.warnlog = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.ara) {
		tableload.ara = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.application) {
		tableload.application = {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: ''
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

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
					const curLevel = Math.floor(0.2 * Math.sqrt(row.points + 1));
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
			}).catch(error => {
				console.error(error);
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

			if (!tableload.modules) {
				tableload.modules = {};
				tableload.modules.fun = 'true';
				tableload.modules.help = 'true';
				tableload.modules.moderation = 'true';
				tableload.modules.music = 'true';
				tableload.modules.nsfw = 'true';
				tableload.modules.searches = 'true';
				tableload.modules.utility = 'true';
				tableload.modules.application = 'true';
				tableload.modules.tickets = 'true';
				await client.guildconfs.set(msg.guild.id, tableload);
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
					client.cooldowns.set(cmd.help.name, new Discord.Collection());
				}

				const now = Date.now();
				const timestamps = client.cooldowns.get(cmd.help.name);
				let cooldownAmount;
				if (tableload.commands[cmd.help.name]) {
					cooldownAmount = cmd.conf.cooldown || Number(tableload.commands[cmd.help.name].cooldown);
				} else {
					cooldownAmount = cmd.conf.cooldown || 3 * 1000;
				}

				if (timestamps.has(msg.author.id)) {
					const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

					if (now < expirationTime) {
						const timeLeft = (expirationTime - now) / 1000;

						const time = moment.duration(parseInt(timeLeft.toFixed(2), 10), 'seconds').format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`);
						const anticommandspam = lang.messageevent_anticommandspam.replace('%time', time).replace('%commandname', `\`${tableload.prefix}${cmd.help.name}\``);
						if (tableload.commanddel === 'true') {
							msg.delete();
						}
						return msg.reply(anticommandspam);
					}

					timestamps.set(msg.author.id, now);
					setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
				} else {
					timestamps.set(msg.author.id, now);
					setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
				}
			}

			/* if (cmd.conf.enabled === false) {
				if (tableload.commanddel === 'true') {
					msg.delete();
				}
				return msg.reply(lang.messageevent_commanddisabled);
			}
			*/

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
