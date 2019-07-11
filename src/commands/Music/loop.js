const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_LOOP_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_LOOP_EXTENDEDHELP'),
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK']
		});
	}

	async run(message) {
		if (!message.member.voice.channel) throw message.language.get('COMMAND_LOOP_NOCHANNEL');
		const music_settings = message.guildSettings.get('music');
		if (!music_settings.queue.length) throw message.language.get('COMMAND_LOOP_NOQUEUE');
		music_settings.loop = !music_settings.loop;
		music_settings.queue[0].repeat = false;
		return message.channel.sendLocale('COMMAND_LOOP_IS', [music_settings.loop]);
	}

};
