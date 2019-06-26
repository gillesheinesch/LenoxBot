const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_TRANSLATE_DESCRIPTION'),
			requiredPermissions: ['SEND_MESSAGES'],
			guarded: true
		});
	}

	run(message) {
		return message.channel.send(new MessageEmbed()
			.setTitle(message.language.get('COMMAND_TRANSLATE_EMBED_TITLE'))
			.setDescription(message.language.get('COMMAND_TRANSLATE_EMBED_DESCRIPTION'))
			.addField(message.language.get('COMMAND_TRANSLATE_EMBEDFIELDTITLE'), 'https://crowdin.com/project/lenoxbot')
			.setURL('https://crowdin.com/project/lenoxbot')
			.setColor('BLUE')
		);
	}
};