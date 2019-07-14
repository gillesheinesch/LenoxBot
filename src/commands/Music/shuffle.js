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
		const shuffle = a => a.reduce((l, e, i) => {
			const j = Math.floor(Math.random() * (a.length - i) + i);
			[a[i], a[j]] = [a[j], a[i]];
			return a;
		}, a);
		const fixedAllDifferentShuffle = ((array, fixed_array) => {
			// memorize position of fixed elements
			const fixed = array.reduce((acc, e, i) => {
				if (fixed_array[i]) acc.push([e, i]);
				return acc;
			}, []);
			array = shuffle(array);
			// swap fixed elements back to their original position
			fixed.forEach(([item, initialIndex]) => {
				const currentIndex = array.indexOf(item);
				[array[initialIndex], array[currentIndex]] = [array[currentIndex], array[initialIndex]];
			});
			return array;
		});

		if (!voice_channel) return message.channel.sendLocale('MUSIC_NOTINVOICECHANNEL');
		if (!music_settings.queue.length || !voice_connection) return message.channel.sendLocale('COMMAND_SHUFFLE_NOTHING');

		try {
			music_settings.queue = fixedAllDifferentShuffle(music_settings.queue, [true]);
			message.channel.sendLocale('COMMAND_SHUFFLE_SHUFFLED');
		} catch (e) {
			throw message.language.get('COMMAND_SHUFFLE_SHUFFLEFAILED');
		}
	}
};