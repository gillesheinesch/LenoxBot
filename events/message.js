const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
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
				msg.reply(`Du bist gerade ein Level aufgestiegen! Du bist jetzt Level **${curLevel}**. Herzlichen Glückwunsch!`);
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
		cmd.run(client, msg, args);
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
	}
};
