const Command = require('../../lib/LenoxCommand');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_VOLUME_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_VOLUME_EXTENDEDHELP'),
			usage: '[volume:integer{0,200}',
			aliases: ['vol'],
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT'],
			userPermissions: ['CONNECT']
		});
	}

	run(message, [set_volume = undefined]) {
		const guild_premium = message.guildSettings.get('premium.status');
		const user_premium = message.author.settings.get('premium.status');
		const { queue, volume } = message.guildSettings.get('music');

		if (!guild_premium && !user_premium) return message.reply(message.language.get('COMMAND_NOPREMIUM'));

		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		const voice_channel = message.member.voice.channel;

		if (!voice_channel) return message.channel.sendLocale('MUSIC_NOTINVOICECHANNEL');
		if (!voice_connection || !queue.length) return messag.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');
		if (!set_volume) return message.channel.sendLocale('COMMAND_VOLUME_CURRENTVOLUME', [parseFloat(voice_connection.dispatcher.volume) * 100]);
		if (set_volume < 0 || set_volume > 200) return message.channel.sendLocale('COMMAND_VOLUME_MUSTBEBETWEEN');

		try {
			voice_connection.dispatcher.setVolume(parseFloat(set_volume) / 100);
			voice_connection.dispatcher.once('volumeChange', (oldVolume, newVolume) => {
				volume = newVolume;
				message.channel.sendLocale('COMMAND_VOLUME_VOLSETTO', [newVolume * 100]);
			});
		} catch (e) {
			throw message.language.get('COMMAND_VOLUME_SETVOLUMEFAILED');
		}
	}
};