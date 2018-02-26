const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
const moment = require('moment');
require('moment-duration-format');
const Discord = require('discord.js');
exports.run = async(client, msg) => {
	if (msg.author.bot) return;

	if (client.user.id === '353115097318555649') {
		if (msg.guild.id !== '332612123492483094') return undefined;
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
			inventoryslotticket: 0
		},
		description: ''
	};
	if (!client.userdb.has(msg.author.id)) {
		await client.userdb.set(msg.author.id, userconfs);
	}

	const tableload = await client.guildconfs.get(msg.guild.id);
	const userdb = await client.userdb.get(msg.author.id);
	const redeemload = client.redeem.get(msg.author.id);

	sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
		if (!row) {
			sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
		}
	  }).catch((error) => {
		console.error(error);
		sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
			sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
		});
	});

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

	if (!tableload.modules.currency) {
		tableload.modules.currency = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
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

	if (!tableload.application.denyrole) {
		tableload.application.denyrole = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!redeemload) {
		const confs = {
			redeemkey: '',
			redeemed: '',
			redeemkeyowner: msg.author.id
		};
		await client.redeem.set(msg.author.id, confs);
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

	if (tableload.language === '') {
        tableload.language = 'en';
        await client.guildconfs.set(msg.guild.id, tableload);
	}

	var lang = require(`../languages/${tableload.language}.json`);

	if (msg.channel.type !== 'text') return msg.reply(lang.messageevent_error);

	if (!tableload.language) {
		tableload.language = `en`;
		await client.guildconfs.set(msg.guild.id, tableload);
	}

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

	// Check if all channels exist
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
		for (var i = 0; i < tableload.musicchannelblacklist.length; i++) {
			if (!msg.guild.channels.get(tableload.musicchannelblacklist[i])) {
				tableload.musicchannelblacklist.splice(i, 1);
			}
		}
		await client.guildconfs.set(msg.guild.id, tableload);
	}
	//

	if (tableload.modules.utility === 'true') {
			sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${msg.author.id}"`).then(row => {
				if (!row) {
					sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [msg.guild.id, msg.author.id, 1, 0]);
				} else {
					let curLevel = Math.floor(0.2 * Math.sqrt(row.points + 1));
					if (curLevel > row.level) {
						row.level = curLevel;
						sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);

						if (tableload.xpmessages === 'true') {
						var levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', row.level);
						msg.channel.send(levelup);
						}
					}
					sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId = "${msg.author.id}"`).then(row => {
						for (let i = 1; i < tableload.ara.length; i += 2) {
							if (tableload.ara[i] < row.points && !msg.member.roles.get(tableload.ara[i - 1])) {
								const role = msg.guild.roles.get(tableload.ara[i - 1]);
								msg.member.addRole(role);

								var automaticrolegotten = lang.messageevent_automaticrolegotten.replace('%rolename', role.name);
								msg.channel.send(automaticrolegotten);
							}
						}
					});
					sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);
				}
			  }).catch((error) => {
				console.error(error);
				sql.run("CREATE TABLE IF NOT EXISTS scores (guildid TEXT, userId TEXT, points INTEGER, level INTEGER)").then(() => {
					sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [msg.guild.id, msg.author.id, 1, 0]);
				});
			});
		}

	if (msg.content.startsWith(tableload.prefix)) {
	var args = msg.content.split(' ').slice(1);
	var command = msg.content.split(' ')[0].slice(tableload.prefix.length).toLowerCase();
	var cmd;

	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	}

	if (cmd) {
		const banlistembed = new Discord.RichEmbed()
		.setColor('#FF0000')
		.setDescription(lang.messageevent_banlist)
		.addField(lang.messageevent_support, 'https://discord.gg/PjZM36X')
		.addField(lang.messageevent_banappeal, 'http://bit.ly/2wQ2SYF')
		.setAuthor(`${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL);

		const blacklistembed = new Discord.RichEmbed()
		.setColor('#FF0000')
		.setDescription(lang.messageevent_blacklist)
		.addField(lang.messageevent_support, 'https://discord.gg/PjZM36X')
		.addField(lang.messageevent_banappeal, 'http://bit.ly/2wQ2SYF')
		.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL);

		const botconfsload = client.botconfs.get('blackbanlist');
		for (var i = 0; i < botconfsload.banlist.length; i++) {
			if (msg.guild.id === botconfsload.banlist[i]) return msg.channel.send({ embed: banlistembed });
	}
		for (var i = 0; i < botconfsload.blacklist.length; i++) {
			if (msg.author.id === botconfsload.blacklist[i]) return msg.channel.send({ embed: blacklistembed });
	}

	const botconfig = client.botconfs.get('botconfs');
	const activityembed = new Discord.RichEmbed()
	.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL)
	.addField('Command', `${tableload.prefix}${command} ${args.join(" ")}`)
	.addField('Guild', `${msg.guild.name} (${msg.guild.id})`)
	.setTimestamp();
	if (botconfig.activity === true) {
		const messagechannel = client.channels.get(botconfig.activitychannel);
		messagechannel.send({ embed: activityembed });
	}

	var botnopermission = lang.messageevent_botnopermission.replace('%missingpermissions', cmd.help.botpermissions.join(', '));
	var usernopermission = lang.messageevent_usernopermission.replace('%missingpermissions', cmd.conf.userpermissions.join(', '));
	if (cmd.help.botpermissions.every(perm => msg.guild.me.hasPermission(perm)) === false) {
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
		return msg.channel.send(botnopermission);
	}
	if (cmd.conf.userpermissions.every(perm => msg.member.hasPermission(perm)) === false) {
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
		return msg.channel.send(usernopermission);
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
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	for (var prop in tableload.modules) {
		if (prop === cmd.help.category) {
			if (tableload.modules[prop] === 'false') {
				var moduledeactivated = lang.messageevent_moduledeativated.replace('%modulename', prop).replace('%prefix', tableload.prefix);
				if (tableload.commanddel === 'true') {
					msg.delete();
				}
				return msg.channel.send(moduledeactivated);
			}
		}
	}

	if (!client.cooldowns.has(cmd.help.name)) {
		client.cooldowns.set(cmd.help.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = client.cooldowns.get(cmd.help.name);
	const cooldownAmount = cmd.conf.cooldown || 3 * 1000;

	if (!timestamps.has(msg.author.id)) {
		timestamps.set(msg.author.id, now);
		setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	}
	else {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;

			const time = moment.duration(parseInt(timeLeft.toFixed(1)), "seconds").format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`);
			var anticommandspam = lang.messageevent_anticommandspam.replace('%time', time).replace('%commandname', `\`${tableload.prefix}${cmd.help.name}\``);
			if (tableload.commanddel === 'true') {
				msg.delete();
			}
			return msg.reply(anticommandspam);
		}

		timestamps.set(msg.author.id, now);
		setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	}

	if (cmd.conf.enabled === false) {
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
		return msg.reply(lang.messageevent_commanddisabled);
	}

	cmd.run(client, msg, args, lang);
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
	} else {
		const input = msg.content.split(' ').slice();
if (tableload.chatfilter.chatfilter === 'true' && tableload.chatfilter.array.length !== 0) {
	for (var i = 0; i < tableload.chatfilter.array.length; i++) {
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
						await msg.guild.channels.get(tableload.chatfilterlogchannel).send({ embed });
					} catch (error) {
						return undefined;
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
			for (var i = 0; i < tableload.chatfilter.array.length; i++) {
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
								await msg.guild.channels.get(tableload.chatfilterlogchannel).send({ embed });
							} catch (error) {
								return undefined;
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
