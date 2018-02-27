const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	const mentioncheck = msg.mentions.users.first();
	const userdb = client.userdb.get(msg.author.id);

	const validation = ['-remind', '-r'];

	for (i = 0; i < args.slice().length; i++) {
		if (validation.indexOf(args.slice()[i].toLowerCase()) >= 0) {
			if (args.slice()[0].toLowerCase() == "-remind" || args.slice()[0].toLowerCase() == "-r") {
				setInterval(function () {
					msg.reply(lang.daily_remind);
				}, 86400000);
			}
		}
	}

	if (!mentioncheck) {
		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + 200} WHERE userId = ${msg.author.id}`);
		});

		const author = lang.daily_author.replace('%amount', `$200`);

			if (args.slice().length !== 0 && (args.slice()[0].toLowerCase() == "-remind" || args.slice()[0].toLowerCase() == "-r")) {
				return msg.channel.send(`🎁 ${author} ${lang.daily_remindmsg}`);
			} else {
			return msg.channel.send(`🎁 ${author}`);
		}
	} else {
		sql.get(`SELECT * FROM medals WHERE userId ="${mentioncheck.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [mentioncheck.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + 200} WHERE userId = ${mentioncheck.id}`);
		});

		const mention = lang.daily_mention.replace('%mentiontag', mentioncheck.tag).replace('%amount', `$200`);
		if (args.slice()[0].toLowerCase() == "-remind" || args.slice()[0].toLowerCase() == "-r") {
			return msg.channel.send(`🎁 ${mention} ${lang.daily_remindmsg}`);
		} else {
			return msg.channel.send(`🎁 ${mention}`);
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['d'],
	userpermissions: [],
	cooldown: 86400000
};
exports.help = {
	name: 'daily',
	description: 'Get your daily reward or give it away to another discord user',
	usage: 'daily [-remind] [@User]',
	example: ['daily', 'daily -remind', 'daily -r @Tester#3873'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
