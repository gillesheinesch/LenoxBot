const Command = require("../../lib/LenoxCommand");
const { RichDisplay, util: { chunk } } = require('klasa');
const { Util: { escapeMarkdown }, MessageEmbed } = require('discord.js');
const parseMilliseconds = require('parse-ms');
const columnify = require('columnify');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_QUEUE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_QUEUE_EXTENDEDHELP'),
			requiredPermissions: ['SEND_MESSAGES']
		});
	}

	run(message) {
		const { queue, loop } = message.guildSettings.get('music');
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		if (!queue.length || !voice_connection) return message.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');
		let total_duration_ms = 0;
		queue.map((audio) => total_duration_ms += audio.duration);

		const paused_play_symbol = voice_connection.dispatcher.paused ? '⏸' : '▶️';
		const repeat_symbol = loop ? '🔁' : queue[0].repeat ? '🔂' : '';

		const audio_queue = message.language.get('COMMAND_QUEUE_AUDIOQUEUE', paused_play_symbol, repeat_symbol);
		const getDuration = ((ms = 0) => {
			const { days, hours, minutes, seconds } = parseMilliseconds(ms);
			return `${days ? `${days.toString().padStart(2, '0')}:` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		});
		const formatQueue = (() => {
			return columnify(queue.map((audio, index) => ({ title: `${index + 1}. ${audio.title}`, duration: index + 1 === 1 ? `[${getDuration(voice_connection.dispatcher.streamTime)}/${getDuration(audio.duration)}]` : `[${getDuration(audio.duration)}]`})), {
				truncate: true,
				truncateMarker: '…',
				showHeaders: false,
				preserveNewLines: false,
				config: {
					title: { maxWidth: 40 },
					duration: { maxWidth: 19, align: 'left' }
				}
			}).split('\n');
		});
		const wrapText = ((text, lang = 'js') => {
			return `\`\`\`${lang}\n${escapeMarkdown(text)}\n\`\`\``;
		});
		const display = new RichDisplay(
			new MessageEmbed()
				.setColor(38550)
				.setAuthor(audio_queue, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg')
		);
		display.setFooterPrefix(message.language.get('COMMAND_QUEUE_EMBEDFOOTER', getDuration(total_duration_ms)));
		//const chunks = queue.map((audio, index) => `**${index + 1}**. ${audio.title} ${index + 1 === 1 ? `\`[${getDuration(voice_connection.dispatcher.streamTime)}/${getDuration(audio.duration)}]\`` : `\`[${getDuration(audio.duration)}]\``}`);
		const queueChunks = chunk(formatQueue(), 10);
		for (const chunky of queueChunks) {
			display.addPage(
				(template) => template.setDescription(wrapText(chunky.join('\n'), 'dos'))
			);
		}

		return this.redirectDisplay(message, display);
	}
};


