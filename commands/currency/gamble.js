const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args, lang) => {
	var d = Math.random();
	const input = args.slice();

	if (!input || input.length === 0) return msg.reply(lang.gamble_noinput);
	if (isNaN(input)) return msg.reply(lang.gamble_notnumber);
	if (parseInt(input.join(" ")) < 10) return msg.reply(lang.gamble_atleast10);
	if (parseInt(input.join(" ")) >= 1000000) return msg.reply(lang.gamble_gamble_max1million);

	var msgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
	if (msgauthortable.medals <= input.join(" ")) return msg.channel.send(lang.gamble_error);

	if (d < 0.4) {
		const possiblewinrates = ['2', '0.2', '0.3', '0.1', '0.2', '0.3', '0.1', '0.2', '0.3', '0.1', '0.2', '0.3', '0.5', '0.7', '0.9', '1', '1.3', '1.6', '1.9'];
		const result = Math.floor(Math.random() * possiblewinrates.length);

		const finalresult = parseInt(input.join(" ") * possiblewinrates[result]);

		await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + finalresult} WHERE userId = ${msg.author.id}`);
		});

		const newmsgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
		const won = lang.gamble_won.replace('%amount', `**${finalresult}**`).replace('%currentcredits', `\`$${newmsgauthortable.medals}\``);
		return msg.channel.send(`🎉 ${won}`);
	} else {
		const result = parseInt(input.join(" "));

		await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals - result} WHERE userId = ${msg.author.id}`);
		});

		const newmsgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
		const lost = lang.gamble_lost.replace('%amount', `**${result}**`).replace('%currentcredits', `\`$${newmsgauthortable.medals}\``);
		return msg.channel.send(`😥 ${lost}`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'gamble',
	description: 'Gamble your credits with a 50% chance to make a profit',
	usage: 'gamble {number}',
	example: ['gamble 1000', 'gamble 8344', 'gamble 828', 'gamble 10'],
	category: 'currency',
    botpermissions: ['SEND_MESSAGES']
};

