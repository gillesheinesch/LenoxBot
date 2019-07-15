const Command = require("../../lib/LenoxCommand");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_STOP_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_STOP_EXTENDEDHELP'),
			aliases: ['disconnect'],
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT'],
			userPermissions: ['CONNECT'],
			permissionLevel: 6
		});
	}

	async run(message) {
		const music_settings = message.guildSettings.get('music');
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		if (!voice_connection || !music_settings.queue.length) return message.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');
		try {
			if (music_settings.queue.length) music_settings.queue.length = 0;
			music_settings.loop = false;
			if (voice_connection) await voice_connection.disconnect();
			message.channel.sendLocale('MUSIC_SUCCESSFULLYDISCONNECTED');
		} catch (e) {
			throw message.language.get('MUSIC_FAILEDTODISCONNECT');
		}
	}
};