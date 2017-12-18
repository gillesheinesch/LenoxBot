const Discord = require('discord.js');
const moment = require('moment');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
require('moment-duration-format');
exports.run = async(client, msg, args) => {
	const array = [];
	
	const now = new Date().getTime();

	const embed = new Discord.RichEmbed()
	.setDescription(`The medal collection event has begun! \nTo participate, you only have to react with "🏅". \nWhen you have done that, you will be credited with 100 🏅. \nThen you can call these with the following command ?medals`)
	.setColor('#ff5050')
	.setFooter(`Event ends on ${new Date(now + 86400000)}`)
	.setAuthor('New Event started!');

	const message = await msg.channel.send({ embed });

	await message.react('🏅');

	var collector = message.createReactionCollector((reaction, user) => reaction.emoji.name === '🏅', { time: 86400000 });
	collector.on('collect', r => {
		if (!array.includes(r.users.last().id)) {
			array.push(r.users.last().id);
		
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
		collector.on('end',(collected, reason) => {
		message.delete();
		});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'startevent',
	description: 'Starts an event on the LenoxBot server',
    usage: 'startevent',
    example: ['startevent'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
