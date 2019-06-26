const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_GITHUB_DESCRIPTION'),
			requiredPermissions: ['SEND_MESSAGES'],
			guarded: true
		});
	}

	run(message) {
		return message.channel.send(new MessageEmbed()
			.setTitle(message.language.get('COMMAND.GITHUB_EMBEDTITLE'))
			.setURL('https://github.com/LenoxBot')
			.setColor('BLUE')
			.setDescription(message.language.get('COMMAND_GITHUB_EMBEDDESCRIPTION'))
			.addField(message.language.get('COMMAND_GITHUB_FIELDTITLECONTRIBUTE'), message.language.get('COMMAND_GITHUB_FIELDDESCRIPTIONCONTRIBUTE'))
			.addField(message.language.get('COMMAND_GITHUB_FIELDTITLELINK'), 'https://github.com/LenoxBot')
		);
	}
};