const Command = require('../../lib/LenoxCommand');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_SHUFFLE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_SHUFFLE_EXTENDEDHELP'),
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT'],
			userPermissions: ['CONNECT']
		});
	}

	run(message) {
		const music_settings = message.guildSettings.get('music');
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		const voice_channel = message.member.voice.channel;
		if (!voice_channel) return message.channel.sendLocale('MUSIC_NOTINVOICECHANNEL');
		if (!music_settings.queue.length || !voice_connection) return message.channel.sendLocale('COMMAND_SHUFFLE_NOTHING');
		if (music_settings.queue[0].isStream) return message.channel.sendLocale('MUSIC_STREAMSCANNOTBESHUFFLED');

		try {
			music_settings.shuffleQueue();
			message.channel.sendLocale('COMMAND_SHUFFLE_SHUFFLED');
		} catch (e) {
			throw message.language.get('COMMAND_SHUFFLE_SHUFFLEFAILED');
		}
	}
};