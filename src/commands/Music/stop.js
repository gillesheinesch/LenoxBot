const Command = require("../../lib/LenoxCommand");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_STOP_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_STOP_EXTENDEDHELP'),
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT'],
			userPermissions: ['CONNECT'],
			permissionLevel: 6
		});
	}

	run(message) {
		const { queue } = message.guildSettings.get('music');
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		if (!voice_connection || !queue.length) return message.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');
		try {
			if (queue.length) queue.length = 0;
			if (voice_connection) voice_connection.disconnect();
			message.channel.sendLocale('MUSIC_SUCCESSFULLYDISCONNECTED');
		} catch (e) {
			message.channel.sendLocale('MUSIC_FAILEDTODISCONNECT');
		}
	}
};