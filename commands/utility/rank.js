const sql = require('sqlite');
const Discord = require('discord.js');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const user1 = msg.mentions.users.first() || msg.author;
	const embed = new Discord.RichEmbed()
		.setColor('#A4F2DF')
		.setThumbnail(user1.avatarURL)
		.setAuthor(user1.tag, user1.avatarURL);

	const allmembersArray = [];
	let i = 0;
	let rank = 0;

	sql.all(`SELECT * FROM scores WHERE guildId = "${msg.guild.id}" GROUP BY userId ORDER BY points DESC`).then(rows =>
		rows.forEach(row => {
			i += 1;
			if (row.userId === user1.id) {
				rank = i;
			}
		}));

	await sql.all(`SELECT (SELECT COUNT (*) FROM scores WHERE guildId = "${msg.guild.id}") AS allmembers`).then(r => allmembersArray.push(r[0].allmembers));
	await sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId = "${user1.id}"`).then(row => {
		if (row) {
			embed.addField(lang.rank_points, row.points, true);
			embed.addField(lang.rank_level, row.level, true);
			embed.addField(lang.rank_rank, `${rank}/${allmembersArray.join('')}`);
		} else {
			embed.addField(lang.rank_points, `0`, true);
			embed.addField(lang.rank_level, `0`, true);
			embed.addField(lang.rank_rank, `${rank}/${allmembersArray.join('')}`);
		}
		return msg.channel.send({ embed });
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'XP',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'rank',
	description: 'Displays the points of you or a user',
	usage: 'rank [@USER]',
	example: ['rank @Monkeyyy11'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
