const Command = require("../../lib/LenoxCommand");
const { RichDisplay, util: { chunk } } = require('klasa');
const { Util: { escapeMarkdown }, MessageEmbed, Permissions } = require('discord.js');
const parseMilliseconds = require('parse-ms');
const columnify = require('columnify');

const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADD_REACTIONS]);
const wrapText = ((content, language = 'js') => `\`\`\`${language}\n${escapeMarkdown(content)}\n\`\`\``);

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_QUEUE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_QUEUE_EXTENDEDHELP'),
			alises: ['q'],
			requiredPermissions: ['SEND_MESSAGES']
		});
	}

	humanize_duration(ms = 0) {
		const [days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds] = Object.values(parseMilliseconds(ms)).map((integer) => integer.toString().padStart(2, '0'));
		const layout = [days, hours, minutes, seconds].filter((integer) => !isNaN(+integer));
		if (layout[0] === '00') layout.shift();
		return layout.join(':');
	}

	async run(message) {
		const music_settings = message.guildSettings.get('music');
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		if (!music_settings.queue.length || !voice_connection) return message.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');
		await music_settings._updateTrack();
		const { queue, loop, total_duration, repeat } = music_settings;

		const paused_play_symbol = voice_connection.dispatcher.paused ? '⏸' : '▶️';
		const repeat_symbol = loop ? '🔁' : repeat ? '🔂' : '';

		const formatQueue = (() => {
			return columnify(queue.map((track, index) => ({ title: `${index + 1}. ${track.title}`, duration: index + 1 === 1 ? `[${this.humanize_duration(voice_connection.dispatcher.streamTime)}${isFinite(track.duration) ? `/${this.humanize_duration(track.duration)}` : ''}]` : `[${this.humanize_duration(track.duration)}]`})), {
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
		if (message.channel.permissionsFor(this.client.user).has(PERMISSIONS_RICHDISPLAY)) {
			const display = new RichDisplay(
				new MessageEmbed()
					.setColor(38550)
					.setAuthor(message.language.get('COMMAND_QUEUE_AUDIOQUEUE', paused_play_symbol, repeat_symbol), 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg')
			);
			display.setFooterPrefix(message.language.get('COMMAND_QUEUE_EMBEDFOOTER', this.humanize_duration(total_duration)));
			//const chunks = queue.map((audio, index) => `**${index + 1}**. ${audio.title} ${index + 1 === 1 ? `\`[${getDuration(voice_connection.dispatcher.streamTime)}/${getDuration(audio.duration)}]\`` : `\`[${getDuration(audio.duration)}]\``}`);
			const queueChunks = chunk(formatQueue(), 10);
			for (const chunky of queueChunks) {
				display.addPage(
					(template) => template.setDescription(wrapText(chunky.join('\n'), 'dos'))
				);
			}

			return this.redirectDisplay(message, display);
		} else {
			return message.channel.send(wrapText(formatQueue().join('\n'), 'dos'));
		}
	}
};