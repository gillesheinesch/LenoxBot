const Discord = require('discord.js');
const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const rows = await sql.all(`SELECT * FROM medals GROUP BY userId ORDER BY medals DESC`);

	const userArray = [];
	const moneyArray = [];
	const tempArray = [];

	rows.forEach(row => {
		const member = client.users.get(row.userId);
		userArray.push(member ? member.tag : row.userId);
		moneyArray.push(row.medals);
	});
	for (let i = 0; i < userArray.length; i++) {
		tempArray.push(`${i + 1}. ${userArray[i]}`);
	}

	const embed = new Discord.RichEmbed()
		.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setColor('#009933')
		.addField(lang.creditranklist_name, tempArray.slice(0, 20).join('\n'), true)
		.addField(lang.creditranklist_credits, moneyArray.slice(0, 20).join('\n'), true);

	await msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Credits',
	aliases: ['richest'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'creditranklist',
	description: `Ranking, sorted by the credits`,
	usage: 'creditranklist',
	example: ['creditranklist'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
