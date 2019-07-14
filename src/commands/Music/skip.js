const Command = require('../../lib/LenoxCommand');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_SKIP_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_SKIP_EXTENDEDHELP'),
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT'],
			userPermissions: ['CONNECT']
		});
	}

	async run(message) {
		const { queue } = message.guildSettings.get('music');
		const skip_vote = message.guildSettings.get('music_settings.skip_vote');
		const skip_number = message.guildSettings.get('music_settings.skip_number');
		const voice_channel = message.member.voice.channel;
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;

		if (!skip_vote) return message.channel.sendLocale('COMMAND_SKIPVOTEDEACTIVATED');
		if (!voice_channel) return message.channel.sendLocale('MUSIC_NOTINVOICECHANNEL');
		if (!queue.length || !voice_connection) return message.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');

		if (voice_connection.dispatcher && voice_channel.members.size === 2) {
			try {
				await voice_connection.dispatcher.end();
				return message.channel.sendLocale('MUSIC_SKIPPEDALONE');
			} catch (e) {
				console.error(e.stack);
				return message.channel.sendLocale('MUSIC_FAILEDTOSKIP')
			}
		}

		const skip_votes = queue[0].skipvotes;

		if (skip_votes.includes(message.author.id)) return message.channel.sendLocale('MUSIC_ALREADYSKIPVOTED');
		skip_votes.push(message.author.id);

		if (skip_votes.length === 1) {
			message.channel.sendLocale('MUSIC_NEWSKIPVOTE', [message.author, skip_number]);
		} else if (skip_votes.length > 1) {
			message.channel.sendLocale('MUSIC_ANOTHERSKIPVOTE', [message.author, skip_votes.length, skip_number]);
		}

		const amount = parseInt(skip_number, 10);

		if (skip_votes.length !== amount) return;

		try {
			if (voice_connection && voice_connection.dispatcher && voice_connection.dispatcher.paused) await voice_connection.dispatcher.resume();
			await voice_connection.dispatcher.end();
			message.channel.sendLocale('MUSIC_SKIPPED');
		} catch (e) {
			throw message.language.get('MUSIC_FAILEDTOSKIP');
		}
	}
};