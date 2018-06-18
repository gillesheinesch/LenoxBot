const Discord = require('discord.js');
const moment = require('moment');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
require('moment-duration-format');

exports.run = async(client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	const now = new Date().getTime();
	const margs = msg.content.split(" ");

	const validation = ['creditsevent', 'lenoxbot', 'extracreditevent'];


	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "creditsevent") {
				var normalevent = [];

				const embed = new Discord.RichEmbed()
					.setDescription(`To participate, you only have to react with "🏅". \n\nWhen you have done that, you will be credited with 100 🏅. \nThen you can call these with the following command: ?credits`)
					.setColor('#ff5050')
					.setFooter(`Event ends on ${new Date(now + 86400000)}`)
					.setAuthor('The credit collection event has begun!');

				const message = await msg.channel.send({
					embed
				});

				await message.react('🏅');

				var normaleventcollector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '🏅' && !user.bot, {
					time: 86400000
				});
				normaleventcollector.on('collect', r => {
					if (!normalevent.includes(r.users.last().id)) {
						normalevent.push(r.users.last().id);

						sql.get(`SELECT * FROM medals WHERE userId ="${r.users.last().id}"`).then(row => {
							if (!row) {
								sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [r.users.last().id, 0]);
							}
							sql.run(`UPDATE medals SET medals = ${row.medals + 100} WHERE userId = ${r.users.last().id}`);
						}).catch((error) => {
							console.error(error);
							sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
								sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [r.users.last().id, 0]);
							});
						});
					}
				});
				normaleventcollector.on('end', (collected, reason) => {
					message.delete();
				});
			} else if (margs[1].toLowerCase() == "lenoxbot") {
				var lenoxbot = [];

				const embed = new Discord.RichEmbed()
					.setDescription(`To participate, you only have to write "LenoxBot" in the #spam channel. \n\nWhen you have done that, you will be credited with 100 🏅. \nThen you can call these with the following command: ?credits`)
					.setColor('#ff5050')
					.setFooter(`Event ends on ${new Date(now + 86400000)}`)
					.setAuthor('The "LenoxBot" SPAM event has begun!');

				const message = await msg.channel.send({
					embed
				});

				var spamchannel = msg.guild.channels.find(r => r.name.toLowerCase() === 'spam');
				var lenoxbotcollector = spamchannel.createMessageCollector(m => m.content.toLowerCase() === 'lenoxbot' && !m.author.bot, {
					time: 86400000
				});

				lenoxbotcollector.on('collect', r => {
					if (!lenoxbot.includes(r.author.id)) {
						lenoxbot.push(r.author.id);

						sql.get(`SELECT * FROM medals WHERE userId ="${r.author.id}"`).then(row => {
							if (!row) {
								sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [r.author.id, 0]);
							}
							sql.run(`UPDATE medals SET medals = ${row.medals + 100} WHERE userId = ${r.author.id}`);
						}).catch((error) => {
							console.error(error);
							sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
								sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [r.author.id, 0]);
							});
						});
						spamchannel.send(`${r.author}, You have successfully received 100 medals!`);
					}
				});
				lenoxbotcollector.on('end', (collected, reason) => {
					message.delete();
				});
			} else if (margs[1].toLowerCase() == "extracreditevent") {
				var extramedalevent = [];

				const embed = new Discord.RichEmbed()
					.setDescription(`To participate, you only have to react with "🏅". \n\nWhen you have done that, you will be credited with **500** 🏅. \nThen you can call these with the following command: ?medals`)
					.setColor('#ff5050')
					.setFooter(`Event ends on ${new Date(now + 86400000)}`)
					.setAuthor('The extra medal collection event has begun!');

				const message = await msg.channel.send({
					embed
				});

				await message.react('🏅');

				var extramedaleventcollector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '🏅' && !user.bot, {
					time: 86400000
				});
				extramedaleventcollector.on('collect', r => {
					if (!extramedalevent.includes(r.users.last().id)) {
						extramedalevent.push(r.users.last().id);

						sql.get(`SELECT * FROM medals WHERE userId ="${r.users.last().id}"`).then(row => {
							if (!row) {
								sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [r.users.last().id, 0]);
							}
							sql.run(`UPDATE medals SET medals = ${row.medals + 500} WHERE userId = ${r.users.last().id}`);
						}).catch((error) => {
							console.error(error);
							sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
								sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [r.users.last().id, 0]);
							});
						});
					}
				});
				extramedaleventcollector.on('end', (collected, reason) => {
					message.delete();
				});
			}
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: [], dashboardsettings: true
};
exports.help = {
	name: 'startevent',
	description: 'Starts an event on the LenoxBot server',
	usage: 'startevent',
	example: ['startevent lenoxbot', 'startevent medalevent'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};