const math = require('math-expression-evaluator');
const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	if (args.length < 1) {
		return msg.channel.send('You have to specify what you would like to count on!').then(m => m.delete(10000));
	}

	const question = args.join(' ');

	let answer;
	try {
		answer = math.eval(question);
	} catch (err) {
		return msg.channel.send(`Invalid mathematical calculation!`);
	}

	const embed = new Discord.RichEmbed()
	.setDescription(` **Calculation:**\n\`\`\`\n${question}\n\`\`\` **Result:**\n\`\`\`\n${answer}\n\`\`\``)
	.setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
	.setFooter('LenoxBot Calculator')
	.setColor('#0066CC');
	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['cal'],
    userpermissions: []
};
exports.help = {
	name: 'calculator',
	description: 'Calculates for you an calculation',
	usage: 'calculator {calculation}',
	example: ['calculator 1*20'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
