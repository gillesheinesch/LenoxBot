const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
const Discord = require('discord.js');
exports.run = (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply('You must run the commands on a Discord server on which the Discord Bot is available');

	sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${msg.author.id}"`).then(row => {
		if (!row) {
			sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [msg.guild.id, msg.author.id, 1, 0]);
		} else {
			let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
			if (curLevel > row.level) {
				row.level = curLevel;
				sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);
			}
			sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);
		}
	  }).catch((error) => {
		console.error(error);
		sql.run("CREATE TABLE IF NOT EXISTS scores (guildid TEXT, userId TEXT, points INTEGER, level INTEGER)").then(() => {
			sql.run("INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)", [msg.guild.id, msg.author.id, 1, 0]);
		});
	});
	const tableload = client.guildconfs.get(msg.guild.id);
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
	.addField('Command', `${tableload.prefix}${command}`)
	.addField('Guild', `${msg.guild.name} (${msg.guild.id})`)
	.setTimestamp();
	if (botconfig.activity === true) {
		const messagechannel = client.channels.get(botconfig.activitychannel);
		messagechannel.send({ embed: activityembed });
	}
		cmd.run(client, msg, args);
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
	}
};
