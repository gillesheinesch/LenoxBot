const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
const Discord = require('discord.js');
exports.run = async(client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply('You must run the commands on a Discord server on which the Discord Bot is available');

	const tableload = await client.guildconfs.get(msg.guild.id);

	if (!tableload.nicknamelog) {
		tableload.nicknamelog = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (!tableload.ara) {
		tableload.ara = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}
			sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${msg.author.id}"`).then(row => {
				if (!row) {
					sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [msg.guild.id, msg.author.id, 1, 0]);
				} else {
					let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
					if (curLevel > row.level) {
						row.level = curLevel;
						sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);
						msg.channel.send(`Congratulatioins ${msg.author}! You are now on level ${row.level}!`);
					}
					sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId = "${msg.author.id}"`).then(row => {
						for (let i = 1; i < tableload.ara.length; i += 2) {
							if (tableload.ara[i] < row.points && !msg.member.roles.get(tableload.ara[i - 1])) {
								const role = msg.guild.roles.get(tableload.ara[i - 1]);
								msg.member.addRole(role);
								msg.channel.send(`You have succesfully gotten the **${role.name}** role! 🎊 `);
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

	if (!msg.content.startsWith(tableload.prefix)) return;
	var command = msg.content.split(' ')[0].slice(tableload.prefix.length).toLowerCase();
	var args = msg.content.split(' ').slice(1);
	let cmd;
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	}
	if (cmd) {
		const banlistembed = new Discord.RichEmbed()
		.setColor('#FF0000')
		.setDescription('Unfortunately, this server was set to the bot\'s banlist. All users on this server cannot execute commands of this bot anymore.')
		.addField('If you have any questions, feel free to join our Discord server', 'https://discord.gg/5mpwCr8')
		.addField('You can also create a ban appeal:', 'http://bit.ly/2wQ2SYF')
		.setAuthor(`${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL);

		const blacklistembed = new Discord.RichEmbed()
		.setColor('#FF0000')
		.setDescription('Unfortunately, you were set to the bot\'s blacklist. You cannot execute commands of this bot anymore.')
		.addField('If you have any questions, feel free to join our Discord server', 'https://discord.gg/5mpwCr8')
		.addField('You can also create a ban appeal:', 'http://bit.ly/2wQ2SYF')
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

	if (cmd.help.botpermissions.every(perm => msg.guild.me.hasPermission(perm)) === false) return msg.channel.send(`It looks like the bot hasn't enough permissions to execute this command! (Required permissions: ${cmd.help.botpermissions.join(', ')})`);
	if (cmd.conf.userpermissions.every(perm => msg.member.hasPermission(perm)) === false) return msg.channel.send(`It looks like you haven't enough permissions to execute this command! (Required permissions: ${cmd.conf.userpermissions.join(', ')})`);

	if (!tableload.modules) {
		tableload.modules = {};
		tableload.modules.fun = 'true';
		tableload.modules.help = 'true';
		tableload.modules.moderation = 'true';
		tableload.modules.music = 'true';
		tableload.modules.nsfw = 'true';
		tableload.modules.searches = 'true';
		tableload.modules.utility = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	for (var prop in tableload.modules) {
		if (prop === cmd.help.category) {
			if (tableload.modules[prop] === 'false') {
				return msg.channel.send(`The module "${prop}" has been disabled. You can reactivate disabled modules by using ${tableload.prefix}activatemodule.`);
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
			return msg.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.help.name}\` command.`);
		}

		timestamps.set(msg.author.id, now);
		setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	}

	cmd.run(client, msg, args);
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
	}
};
