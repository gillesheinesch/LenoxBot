const Discord = require('discord.js');
module.exports = {
	run: (messages) => {
		if (!client.provider.isReady) return;
		if (messages.size === 0) return;

		/* eslint guard-for-in: 0 */
		messages.forEach(msg => {
			if (msg.author.bot) return;
			if (msg.channel.type !== 'text') return;

			if (!client.provider.getGuild(msg.guild.id, 'prefix')) return;

			if (client.provider.getGuild(msg.guild.id, 'messagedellog') === 'false') return;
			const messagechannel = client.channels.get(client.provider.getGuild(msg.guild.id, 'messagedellogchannel'));

			if (!messagechannel) return;

			const lang = require(`../languages/${client.provider.getGuild(msg.guild.id, 'language')}.json`);

			const embed = new Discord.MessageEmbed()
				.setColor('RED')
				.setTimestamp()
				.setAuthor(lang.messagedeleteevent_deleted)
				.addField(`🗣 ${lang.messagedeleteevent_author}`, msg.author.tag)
				.addField(`📲 ${lang.messagedeleteevent_channel}`, `${msg.channel.name} (${msg.channel.id})`)
				.addField(`📎 ${lang.messagedeleteevent_mid}`, msg.id)
				.addField(`📜 ${lang.messagedeleteevent_message}`, msg.cleanContent.length >= 1 ? msg.cleanContent.substring(0, 960) : '-');

			messagechannel.send({
				embed: embed
			});
		});
	}
};
