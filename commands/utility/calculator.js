const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const math = require('math-expression-evaluator');

module.exports = class calculatorCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'calculator',
			group: 'utility',
			memberName: 'calculator',
			description: 'Calculates for you an calculation',
			format: 'calculator {math equation}',
			aliases: ['cal'],
			examples: ['calculator 1*20', 'calculator 100/10', 'calculator 100+10', 'calculator 100-10'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const args = msg.content.split(' ').slice(1);

		if (args.length < 1) {
			return msg.channel.send(lang.calculator_noinput);
		}

		const mathEquation = args.join(' ');
		let answer;
		try {
			answer = math.eval(mathEquation);
		} catch (err) {
			return msg.channel.send(lang.calculator_invalid);
		}

		const embed = new Discord.RichEmbed()
			.setDescription(`**${lang.calculator_calculation}**\n\`\`\`\n${mathEquation}\n\`\`\` **${lang.calculator_result}**\n\`\`\`\n${answer}\n\`\`\``)
			.setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
			.setColor('#0066CC');
		msg.channel.send({ embed });
	}
};
