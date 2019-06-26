const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			description: (language) => language.get('COMMAND_EIGHTBALL_DESCRIPTION'),
			extendedHelp: (language) => language.get('COMMAND_EIGHTBALL_EXTENDEDHELP'),
			usage: '<Question:str>',
			requiredPermissions: ['SEND_MESSAGES']
		});
	}

	run(message, [question]) {
		if (!question) return message.sendLocale('COMMAND_EIGHTBALL_NOINPUT');
		const eightballAnswers = message.language.get('COMMAND_EIGHTBALL_ANSWERS');
		const eightballAnswersIndex = Math.floor(Math.random() * eightballAnswers.length);

		message.channel.send(new MessageEmbed()
			.addField(message.language.get('COMMAND_EIGHTBALL_QUESTION'), question)
			.addField(message.language.get('COMMAND_EIGHTBALL_EMBEDFIELD'), eightballAnswers[eightballAnswersIndex])
			.setColor('#ff6666')
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
		);
	}
};