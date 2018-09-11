const slotThing = [':grapes:', ':tangerine:', ':pear:', ':cherries:'];
const Discord = require('discord.js');
const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const msgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
	if (msgauthortable.medals < 50) return msg.channel.send(lang.slot_error);

	const slotOne = slotThing[Math.floor(Math.random() * slotThing.length)];
	const slotTwo = slotThing[Math.floor(Math.random() * slotThing.length)];
	const slotThree = slotThing[Math.floor(Math.random() * slotThing.length)];
	if (slotOne === slotTwo && slotOne === slotThree) {
		const embed1 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#3ADF00')
			.addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_triple);
		msg.channel.send({ embed: embed1 });

		await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + 100} WHERE userId = ${msg.author.id}`);
		});
	} else
	if (slotOne === slotTwo || slotTwo === slotThree) {
		const embed3 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#3ADF00')
			.addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_double);
		msg.channel.send({ embed: embed3 });

		await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + 25} WHERE userId = ${msg.author.id}`);
		});
	} else {
		const embed2 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#3ADF00')
			.addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_nothing);
		msg.channel.send({ embed: embed2 });

		await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals - 50} WHERE userId = ${msg.author.id}`);
		});
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Games',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'slot',
	description: 'Play a round with the slot machine',
	usage: 'slot',
	example: ['slot'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
