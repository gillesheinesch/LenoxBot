const Command = require('../../lib/LenoxCommand');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_RESUME_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_RESUME_EXTENDEDHELP'),
			aliases: ['unpause'],
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT'],
			userPermissions: ['CONNECT']
		});
	}

	async run(message) {
		const { queue } = message.guildSettings.get('music');
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		const voice_channel = message.member.voice.channel;
		if (!voice_channel) return message.channel.sendLocale('MUSIC_NOTINVOICECHANNEL');
		if (!queue.length || !voice_connection) return message.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');
		if (voice_connection.dispatcher) {
			if (!voice_connection.dispatcher.paused) return message.channel.sendLocale('MUSIC_NOTPAUSED');
			try {
				await voice_connection.dispatcher.resume();
				message.channel.sendLocale('MUSIC_UNPAUSED');
			} catch (e) {
				throw message.language.get('MUSIC_UNPAUSEFAILED');
			}
		}
	}
};