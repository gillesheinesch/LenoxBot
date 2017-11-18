const sql = require("sqlite");
const Discord = require('discord.js');
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args) => {
	const user1 = msg.mentions.users.first() || msg.author;
	const embed = new Discord.RichEmbed()
	.setColor('#A4F2DF')
	.setThumbnail(user1.avatarURL)
	.setAuthor(user1.tag, user1.avatarURL);

	var allmembersArray = [];
	var i = 0;
	var rank = 0;

	sql.all(`SELECT * FROM scores WHERE guildId = "${msg.guild.id}" GROUP BY userId ORDER BY points DESC`).then(rows =>
	rows.forEach(row => {
		i = i + 1;
		if (row.userId === user1.id) {
			rank = i;
		}
	}));

	await sql.all(`SELECT (SELECT COUNT (*) FROM scores WHERE guildId = "${msg.guild.id}") AS allmembers`).then(r => allmembersArray.push(r[0].allmembers));
	await sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId = "${user1.id}"`).then(row => {
		if (!row) {
			embed.addField('Points', `0`, true);
			embed.addField('Level', `0`, true);
			embed.addField('Rank', `${rank}/${allmembersArray.join('')}`);
		} else {
			embed.addField('Points', row.points, true);
			embed.addField('Level', row.level, true);
			embed.addField('Rank', `${rank}/${allmembersArray.join('')}`);
		}
		return msg.channel.send({ embed });
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'rank',
	description: 'Displays the points of you or a user',
	usage: 'rank [@USER]',
	example: 'rank @Monkeyyy11',
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
