const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_VOTE_DESCRIPTION'),
			requiredPermissions: ['SEND_MESSAGES'],
			guarded: true
		});
	}

	run(message) {
		return message.channel.send(new MessageEmbed()
			.setAuthor(message.language.get('COMMAND_VOTE_EMBEDAUTHOR'))
			.setColor('BLUE')
			.setDescription(message.language.get('COMMAND_VOTE_EMBEDDESCRIPTION', 'https://discordbots.org/bot/lenoxbot/vote')));
	}
};
