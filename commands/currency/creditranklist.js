const Discord = require('discord.js');
const sql = require("sqlite");
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args, lang) => {
	const rows = await sql.all(`SELECT * FROM medals GROUP BY userId ORDER BY medals DESC`);

		let userArray = [];
		let moneyArray = [];
		let tempArray = [];

	rows.forEach(row => {
		const member = msg.guild.member(row.userId);
		userArray.push(member ? member.displayName : row.userId);
		moneyArray.push(row.medals);
	});
	for (i = 0; i < userArray.length; i++) {
		tempArray.push((i+1) + ". " + userArray[i]);
	}

	let embed = new Discord.RichEmbed()
	.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
	.setColor('#009933')
	.addField(lang.creditranklist_name, tempArray.slice(0, 20).join('\n'), true)
	.addField(lang.creditranklist_credits, moneyArray.slice(0, 20).join('\n'), true);

		const message = await msg.channel.send({ embed });
		
		await message.react('◀');
		await message.react('▶');
		
		var first = 0;
		var second = 20;
		
		var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
	collector.on('collect', r => {
		var reactionadd = moneyArray.slice(first + 20, second + 20).length;
		var reactionremove = moneyArray.slice(first - 20, second - 20).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			r.remove(msg.author.id);
			const thefirst = moneyArray.slice(first + 20, second + 20);
			const thesecond = tempArray.slice(first + 20, second + 20);

			first = first + 20;
			second = second + 20;

			const newembed = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#009933')
			.addField(lang.creditranklist_name, thesecond.join('\n'), true)
			.addField(lang.creditranklist_credits, thefirst.join('\n'), true);
		
		message.edit({ embed: newembed });
	  	} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			r.remove(msg.author.id);
			const thefirst = moneyArray.slice(first - 20, second - 20);
			const thesecond = tempArray.slice(first - 20, second - 20);
		
			first = first - 20;
			second = second - 20;
		
			const newembed = new Discord.RichEmbed()
			.addField(lang.creditranklist_name, thesecond.join('\n'), true)
			.addField(lang.creditranklist_credits, thefirst.join('\n'), true)
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#009933');
		
		message.edit({ embed: newembed });
		}
	});
		collector.on('end',(collected, reason) => {
		message.react('❌');
		});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['richest'],
    userpermissions: []
};
exports.help = {
	name: 'creditranklist',
	description: `Ranking, sorted by the credits`,
	usage: 'creditranklist',
	example: ['creditranklist'],
	category: 'currency',
    botpermissions: ['SEND_MESSAGES']
};
