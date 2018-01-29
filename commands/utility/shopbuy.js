const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	const tableload = client.botconfs.get('botconfs');
	let input = args.slice();

	if (!input || input.length === 0) return msg.reply(lang.join_noinput);

	try {
		var foundrole = msg.guild.roles.find(r => r.name.toLowerCase() === input.join(" ").toLowerCase());
	} catch (error) {
		return msg.reply(lang.join_rolenotexist);
	}

	for (var i = 0; i < tableload.shopitems.length; i += 2) {
		if (tableload.shopitems[i] === foundrole.id) {
			if (msg.member.roles.has(foundrole.id)) return msg.reply(lang.join_alreadyhave);

			const msgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
			if (msgauthortable.medals < tableload.shopitems[i + 1]) return msg.channel.send(lang.paymedals_notenough);

			await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
				if (!row) {
					sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
				}
				sql.run(`UPDATE medals SET medals = ${row.medals - tableload.shopitems[i + 1]} WHERE userId = ${msg.author.id}`);
			}).catch((error) => {
				console.error(error);
				sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
					sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
				});
			});
			msg.member.addRole(foundrole);
			return msg.reply(lang.shopbuy_added);
		}
	}
	return msg.reply(lang.shopbuy_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'shopbuy',
	description: 'Buy something from the shop (with medals)',
	usage: 'shopbuy {rolename}',
	example: ['shopbuy 5k Club'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};