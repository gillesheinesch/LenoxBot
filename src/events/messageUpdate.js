const Discord = require('discord.js');
module.exports = {
	run: async (oldMsg, newMsg) => {
		if (!client.provider.isReady) return;
		if (newMsg.author.bot) return;
		if (newMsg.channel.type !== 'text') return;

		if (!client.provider.getGuild(newMsg.guild.id, 'prefix')) return;

		const lang = require(`../languages/${client.provider.getGuild(newMsg.guild.id, 'language')}.json`);

		if (client.provider.getGuild(newMsg.guild.id, 'messageupdatelog') === 'true') {
			const messagechannel = client.channels.get(client.provider.getGuild(newMsg.guild.id, 'messageupdatelogchannel'));
			if (!messagechannel) return;
			if (oldMsg.cleanContent !== newMsg.cleanContent) {
				const embed = new Discord.MessageEmbed()
					.setColor('ORANGE')
					.setTimestamp()
					.setAuthor(lang.messageupdateevent_updated)
					.addField(`🗣 ${lang.messagedeleteevent_author}:`, newMsg.author.tag)
					.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${newMsg.channel.name} (${newMsg.channel.id})`)
					.addField(`📎 ${lang.messagedeleteevent_mid}:`, newMsg.id)
					.addField(`📤 ${lang.messageupdateevent_old}:`, oldMsg.cleanContent.length < 960 ? oldMsg.cleanContent : `${oldMsg.cleanContent.substring(0, 960)} ...`)
					.addField(`📥 ${lang.messageupdateevent_new}:`, newMsg.cleanContent.length < 960 ? newMsg.cleanContent : `${newMsg.cleanContent.substring(0, 960)} ...`);
				messagechannel.send({
					embed: embed
				});
			}
		}
		const input = newMsg.content.split(' ').slice();
		if (client.provider.getGuild(newMsg.guild.id, 'chatfilter').chatfilter === 'true' && client.provider.getGuild(newMsg.guild.id, 'chatfilter').array.length !== 0) {
			for (let i = 0; i < client.provider.getGuild(newMsg.guild.id, 'chatfilter').array.length; i += 1) {
				for (let index = 0; index < input.length; index += 1) {
					if (input[index].toLowerCase() === client.provider.getGuild(newMsg.guild.id, 'chatfilter').array[i].toLowerCase()) {
						if (client.provider.getGuild(newMsg.guild.id, 'chatfilterlog') === 'true') {
							const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', newMsg.author.tag);

							const embed = new Discord.MessageEmbed()
								.addField(`🗣 ${lang.messagedeleteevent_author}:`, newMsg.author.tag)
								.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${newMsg.channel.name} (${newMsg.channel.id})`)
								.addField(`📥 ${lang.messagereactionaddevent_message}:`, newMsg.cleanContent)
								.setColor('#FF0000')
								.setAuthor(chatfilterembed);

							try {
								newMsg.guild.channels.get(client.provider.getGuild(newMsg.guild.id, 'chatfilterlogchannel')).send({
									embed
								});
							} catch (error) {
								return;
							}
						}
						await newMsg.delete();

						const messagedeleted = lang.messageevent_messagedeleted.replace('%author', newMsg.author);
						newMsg.channel.send(messagedeleted);
					}
				}
			}
		}
	}
};
