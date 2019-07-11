const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: [],
			description: '',
			extendedHelp: 'No extended help available.',
		});
	}

	async run(message) {
		if (!message.member.voice.channel) throw message.language.get('COMMAND_LOOP_NOCHANNEL');
		if (!message.guildSettings.get('music').queue.length) throw message.language.get('COMMAND_LOOP_NOQUEUE');

		message.guildSettings.get('music').loop = !message.guildSettings.get('music').loop;
		message.guildSettings.get('music').queue[0].repeat = false;
		return message.sendLocale('COMMAND_LOOP_IS', [message.guildSettings.get('music').loop, message.guildSettings.get('music').queue[0].repeat]);
	}

};
