const Discord = require('discord.js');
const sql = require("sqlite");
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args) => {
let input = parseInt(args.slice().join(' '));
if (!input) {
	sql.all(`SELECT * FROM scores WHERE guildId = "${msg.guild.id}" GROUP BY userId ORDER BY points DESC LIMIT 10`).then(rows => {
		let embed = new Discord.RichEmbed()
			.setFooter('Top 10')
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#A4F2DF');

		let userArray = [];
		let moneyArray = [];
		let levelArray = [];
		let tempArray = [];

	rows.forEach(row => {
		const member = msg.guild.member(row.userId);
		userArray.push(member ? member.displayName : row.userId);
		moneyArray.push(row.points);
		levelArray.push(row.level);
	});
	for (i = 0; i < userArray.length; i++) {
		tempArray.push((i+1) + ". " + userArray[i]);
}
		embed.addField('Name', tempArray.join('\n'), true);
		embed.addField('Points', moneyArray.join('\n'), true);
		embed.addField('Level', levelArray.join('\n'), true);
				
		msg.channel.send({ embed });
	});
} else {
if (input > 50) return msg.reply('You can only display TOP 1 to TOP 50!');
	sql.all(`SELECT * FROM scores WHERE guildId = "${msg.guild.id}" GROUP BY userId ORDER BY points DESC LIMIT ${input}`).then(rows => {
		let embed = new Discord.RichEmbed()
			.setFooter(`Top ${input}`)
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#A4F2DF');

			let userArray = [];
			let moneyArray = [];
			let levelArray = [];
			let tempArray = [];
	
		rows.forEach(row => {
			const member = msg.guild.member(row.userId);
			userArray.push(member ? member.displayName : row.userId);
			moneyArray.push(row.points);
			levelArray.push(row.level);
		});
	  
		for (i = 0; i < userArray.length; i++) {
			tempArray.push((i+1) + ". " + userArray[i]);
	} 
	embed.addField('Name', tempArray.join('\n'), true);
	embed.addField('Points', moneyArray.join('\n'), true);
	embed.addField('Level', levelArray.join('\n'), true);

			msg.channel.send({ embed });
		});
}
	};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'ranks',
	description: `Ranking list, sorted by points`,
	usage: 'ranks [1-50]',
	example: ['ranks 20'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
