const math = require('math-expression-evaluator');
const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	if (args.length < 1) {
		return msg.channel.send(lang.calculator_noinput);
	}

	const question = args.join(' ');

	let answer;
	try {
		answer = math.eval(question);
	} catch (err) {
		return msg.channel.send(lang.calculator_invalid);
	}

	const embed = new Discord.RichEmbed()
		.setDescription(`**${lang.calculator_calculation}**\n\`\`\`\n${question}\n\`\`\` **${lang.calculator_result}**\n\`\`\`\n${answer}\n\`\`\``)
		.setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
		.setColor('#0066CC');
	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: ['cal'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'calculator',
	description: 'Calculates for you an calculation',
	usage: 'calculator {calculation}',
	example: ['calculator 1*20', 'calculator 100/10', 'calculator 100+10', 'calculator 100-10'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
