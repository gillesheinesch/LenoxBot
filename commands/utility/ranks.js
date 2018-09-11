const Discord = require('discord.js');
const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const rows = await sql.all(`SELECT * FROM scores WHERE guildId = "${msg.guild.id}" GROUP BY userId ORDER BY points DESC`);

	const userArray = [];
	const moneyArray = [];
	const levelArray = [];
	const tempArray = [];

	rows.forEach(row => {
		const member = client.users.get(row.userId);
		userArray.push(member ? member.tag : row.userId);
		moneyArray.push(row.points);
		levelArray.push(row.level);
	});
	for (let i = 0; i < userArray.length; i++) {
		tempArray.push(`${i + 1}. ${userArray[i]}`);
	}

	const embed = new Discord.RichEmbed()
		.setColor('#A4F2DF')
		.addField(lang.ranks_name, tempArray.slice(0, 20).join('\n'), true)
		.addField(lang.ranks_points, moneyArray.slice(0, 20).join('\n'), true)
		.addField(lang.ranks_level, levelArray.slice(0, 20).join('\n'), true);

	const message = await msg.channel.send({ embed });

	if (levelArray.length < 21) return; // Check if reactions are needed

	await message.react('◀');
	await message.react('▶');

	let first = 0;
	let second = 20;

	const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
	collector.on('collect', r => {
		const reactionadd = levelArray.slice(first + 20, second + 20).length;
		const reactionremove = levelArray.slice(first - 20, second - 20).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			r.remove(msg.author.id);
			const thefirst = moneyArray.slice(first + 20, second + 20);
			const thesecond = levelArray.slice(first + 20, second + 20);
			const thethird = tempArray.slice(first + 20, second + 20);

			first += 20;
			second += 20;

			const newembed = new Discord.RichEmbed()
				.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
				.setColor('#A4F2DF')
				.addField(lang.ranks_name, thethird.join('\n'), true)
				.addField(lang.ranks_points, thefirst.join('\n'), true)
				.addField(lang.ranks_level, thesecond.join('\n'), true);

			message.edit({ embed: newembed });
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			r.remove(msg.author.id);
			const thefirst = moneyArray.slice(first - 20, second - 20);
			const thesecond = levelArray.slice(first - 20, second - 20);
			const thethird = tempArray.slice(first - 20, second - 20);

			first -= 20;
			second -= 20;

			const newembed = new Discord.RichEmbed()
				.addField(lang.ranks_name, thethird.join('\n'), true)
				.addField(lang.ranks_points, thefirst.join('\n'), true)
				.addField(lang.ranks_level, thesecond.join('\n'), true)
				.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
				.setColor('#A4F2DF');

			message.edit({ embed: newembed });
		}
	});
	collector.on('end', () => {
		message.react('❌');
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
	name: 'ranks',
	description: `Ranking list, sorted by points`,
	usage: 'ranks',
	example: ['ranks'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
