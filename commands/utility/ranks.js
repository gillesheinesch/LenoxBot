const Discord = require('discord.js');
const sql = require("sqlite");
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args) => {
	const content = args.slice();
	let input = parseInt(args.slice().join(' '));
if (content.length === 0) {
	const rows = await sql.all(`SELECT * FROM scores WHERE guildId = "${msg.guild.id}" GROUP BY userId ORDER BY points DESC`);

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

	let embed = new Discord.RichEmbed()
	.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
	.setColor('#A4F2DF')
	.addField('Name', tempArray.slice(0, 20).join('\n'), true)
	.addField('Points', moneyArray.slice(0, 20).join('\n'), true)
	.addField('Level', levelArray.slice(0, 20).join('\n'), true);

		const message = await msg.channel.send({ embed });
		
		await message.react('◀');
		await message.react('▶');
		
		var first = 0;
		var second = 20;
		
		var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
	collector.on('collect', r => {
		var reactionadd = levelArray.slice(first + 20, second + 20).length;
		var reactionremove = levelArray.slice(first - 20, second - 20).length;
		console.log(1);
		if (r.emoji.name === '▶' && reactionadd !== 0) {
			const thefirst = moneyArray.slice(first + 20, second + 20);
			const thesecond = levelArray.slice(first + 20, second + 20);
			const thethird = tempArray.slice(first + 20, second + 20);
			console.log(thethird);
			console.log(2);
			first = first + 20;
			second = second + 20;

			const newembed = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#A4F2DF')
			.addField('Name', thethird.join('\n'), true)
			.addField('Points', thesecond.join('\n'), true)
			.addField('Level', thefirst.join('\n'), true);
		
		message.edit({ embed: newembed });
	  	} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			moneyArray = moneyArray.slice(first - 20, second - 20);
			levelArray = levelArray.slice(first - 20, second - 20);
			tempArray = tempArray.slice(first - 20, second - 20);
		
			first = first - 20;
			second = second - 20;
		
			const newembed = new Discord.RichEmbed()
			.addField('Name', tempArray.join('\n'), true)
			.addField('Points', moneyArray.join('\n'), true)
			.addField('Level', levelArray.join('\n'), true)
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#A4F2DF');
		
		message.edit({ newembed });
		}
	});
		collector.on('end',(collected, reason) => {
		message.react('❌');
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
