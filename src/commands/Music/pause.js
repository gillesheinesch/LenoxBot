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


		const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send(lang.pause_paused);
		}
		return msg.channel.send(lang.pause_nothing);
	}
};


		const voice_connection = msg.guild.voice.connection;
		
		
		if (fetched_queue.is_streaming) return msg.channel.send('<:redx:411978781226696705> Streams cannot be paused.');
		if (voice_connection.player.dispatcher) {
			if (!voice_connection.player.dispatcher.pause) return msg.channel.send('<:redx:411978781226696705> Playback already paused!');
			try {
				voice_connection.player.dispatcher.pause();
				msg.channel.send('<:check:411976443522711552> Playback paused.');
			} catch (e) {
				msg.channel.send('<:redx:411978781226696705> Failed to pause playback.');
			}
		}
