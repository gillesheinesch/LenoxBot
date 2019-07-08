const { Monitor } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			ignoreEdits: false,
			ignoreOthers: false
		});
	}

	async run(message) {
		if (!message.guild || !message.content || !message.content.length) return;

		const [enabled, array, logEnabled, logChannel] = message.guildSettings.pluck('chatfilter.chatfilter_enabled', 'chatfilter.chatfilter_array', 'chatfilter.chatfilterlog_enabled', 'chatfilter.chatfilterlog_channel');
		if (!enabled || !array.length || message.command) return;

		const getFiltered = message.content.split(' ').filter(word => array.includes(word));
		if (!getFiltered.length) return;

		if (logEnabled && logChannel) {
			message.guild.channels.get(logChannel).send(new MessageEmbed()
				.setAuthor(`A message from ${message.author.tag} was deleted by the chat filter.`)
				.setColor('RED')
				.addField(`🗣 ${message.language.get('MONITOR_CHATFILTER_AUTHOR')}:`, message.author.tag)
				.addField(`📲 ${message.language.get('MONITOR_CHATFILTER_CHANNEL')}:`, `${message.channel} (${message.channel.id})`)
				.addField(`📥 ${message.language.get('MONITOR_CHATFILTER_MESSAGE')}:`, message.cleanContent)
			);
		}

		await message.delete()
			.then((msg) => {
				return msg.channel.sendLocale('MONITOR_CHATFILTER_MSGDELETED', [msg.author]);
			}).catch((error) => { })
	}

};
