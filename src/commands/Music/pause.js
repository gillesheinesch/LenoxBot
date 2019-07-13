const Command = require('../../lib/LenoxCommand');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_PAUSE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_PAUSE_EXTENDEDHELP'),
			examples: ['pause'],
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT'],
			userPermissions: ['CONNECT']
		});
	}

	run(message) {
		const { queue } = message.guildSettings.get('music');
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		const voice_channel = message.member.voice.channel;
		if (!voice_channel) return message.channel.sendLocale('MUSIC_NOTINVOICECHANNEL');
		if (!queue.length || !voice_connection) return message.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');
		if (queue[0].isStream) return message.channel.sendLocale('MUSIC_STREAMSCANNOTBEPAUSED');
		if (voice_connection.dispatcher) {
			if (voice_connection.dispatcher.paused) return message.channel.sendLocale('MUSIC_ALREADYPAUSED');
			try {
				voice_connection.dispatcher.pause();
				message.channel.sendLocale('MUSIC_PAUSED');
			} catch (e) {
				message.channel.sendLocale('MUSIC_PAUSEDFAILED');
			}
		}
	}
};