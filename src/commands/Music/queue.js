const Command = require("../../lib/LenoxCommand");
const { RichDisplay, util: { chunk } } = require('klasa');
const { MessageEmbed } = require('discord.js');
const parseMilliseconds = require('parse-ms');

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
		const { queue } = message.guildSettings.get('music');
		const voice_connection = message.guild.voice ? message.guild.voice.connection : null;
		if (!queue.length || !voice_connection) return message.channel.sendLocale('MUSIC_NOAUDIOBEINGPLAYED');
		let total_duration_ms = 0;

		const audio_queue = message.language.get('COMMAND_QUEUE_AUDIOQUEUE', queue[0].title);
		const getDuration = ((ms) => {
			const { days, hours, minutes, seconds } = parseMilliseconds(ms);
			return `${days ? `${days.toString().padStart(2, '0')}:` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		});
		queue.map((audio) => total_duration_ms += audio.duration);
		const display = new RichDisplay(
			new MessageEmbed()
				.setColor(38550)
				.setAuthor(audio_queue, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg')
		);
		display.setFooterPrefix(message.language.get('COMMAND_QUEUE_EMBEDFOOTER', getDuration(total_duration_ms)));
		const queueChunks = chunk(queue, 15);
		const chunks = queueChunks.map((audio, index) => `**${index + 1}**. ${audio.title} ${index + 1 === 1 ? `\`[${getDuration(audio.duration - voice_connection.dispatcher.streamTime)}/${getDuration(audio.duration)}]\`` : `\`[${getDuration(audio.duration)}]\``}`);
		for (const chunky of chunks) {
			display.addPage(
				(template) => template.setDescription(chunky.join('\n'))
			);
		}

		return this.redirectDisplay(message, display);
	}
};