const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
const Discord = require('discord.js');
exports.run = async(client, msg) => {
	if (msg.author.bot) return;

	const tableload = await client.guildconfs.get(msg.guild.id);

	const redeemload = client.redeem.get(msg.author.id);
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

	if (tableload.modules.utility === 'true') {
			sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${msg.author.id}"`).then(row => {
				if (!row) {
					sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [msg.guild.id, msg.author.id, 1, 0]);
				} else {
					let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
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
	if (cmd.help.botpermissions.every(perm => msg.guild.me.hasPermission(perm)) === false) return msg.channel.send(botnopermission);
	if (cmd.conf.userpermissions.every(perm => msg.member.hasPermission(perm)) === false) return msg.channel.send(usernopermission);

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
				return msg.channel.send(moduledeactivated);
			}
		}
	}

	if (!client.cooldowns.has(cmd.help.name)) {
		client.cooldowns.set(cmd.help.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = client.cooldowns.get(cmd.help.name);
	const cooldownAmount = 3 * 1000;

	if (!timestamps.has(msg.author.id)) {
		timestamps.set(msg.author.id, now);
		setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	}
	else {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;

			var anticommandspam = lang.messageevent_anticommandspam.replace('%time', timeLeft.toFixed(1)).replace('%commandname', cmd.help.name);
			return msg.reply(anticommandspam);
		}

		timestamps.set(msg.author.id, now);
		setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	}

	cmd.run(client, msg, args, lang);
		if (tableload.commanddel === 'true') {
			return msg.delete();
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
