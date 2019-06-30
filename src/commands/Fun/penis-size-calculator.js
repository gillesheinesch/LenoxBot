const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PENISSIZECALCULATOR_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_PENISSIZECALCULATOR_EXTENDEDHELP'),
			usage: '[GuildMember:member]',
			aliases: ['psc'],
			requiredPermissions: ['SEND_MESSAGES']
		});
	}

	run(message, [member]) {
		const pscAnswers = message.language.get('COMMAND_PENISSIZECALCULATOR_ANSWERS');
		const pscAnswersIndex = Math.floor(Math.random() * pscAnswers.length);

		if (!member) return message.channel.send(`${message.author}, ${pscAnswers[pscAnswersIndex]}`);
		message.channel.send(`${member.displayName}, ${pscAnswers[pscAnswersIndex]}`);
	}
};
