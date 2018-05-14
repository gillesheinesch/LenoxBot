const Discord = require('discord.js');
exports.run = async (client, oldMsg, newMsg) => {
	var tableload = await client.guildconfs.get(newMsg.guild.id);

	if (tableload.language === '') {
		tableload.language = 'en';
		await client.guildconfs.set(newMsg.guild.id, tableload);
	}

	var lang = require(`../languages/${tableload.language}.json`);

	if (newMsg.author.bot) return;
	if (newMsg.channel.type !== 'text') return newMsg.reply(lang.messageevent_error);

	if (tableload.messageupdatelog === 'true') {
		const messagechannel = client.channels.get(tableload.messageupdatelogchannel);
		if (oldMsg.cleanContent !== newMsg.cleanContent) {
			const embed = new Discord.RichEmbed()
				.setColor('#FE2E2E')
				.setTimestamp()
				.setAuthor(lang.messageupdateevent_updated)
				.addField(`🗣 ${lang.messagedeleteevent_author}:`, newMsg.author.tag)
				.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${newMsg.channel.name} (${newMsg.channel.id})`)
				.addField(`📎 ${lang.messagedeleteevent_mid}:`, newMsg.id)
				.addField(`📤 ${lang.messageupdateevent_old}:`, oldMsg.cleanContent.length < 960 ? oldMsg.cleanContent : oldMsg.cleanContent.substring(0, 960) + ' ...')
				.addField(`📥 ${lang.messageupdateevent_new}:`, newMsg.cleanContent.length < 960 ? newMsg.cleanContent : newMsg.cleanContent.substring(0, 960) + ' ...');
			messagechannel.send({
				embed: embed
			});
		}
	}
	const input = newMsg.content.split(' ').slice();
	if (tableload.chatfilter.chatfilter === 'true' && tableload.chatfilter.array.length !== 0) {
		for (var i = 0; i < tableload.chatfilter.array.length; i++) {
			for (let index = 0; index < input.length; index++) {
				if (input[index].toLowerCase() === tableload.chatfilter.array[i].toLowerCase()) {
					if (tableload.chatfilterlog === 'true') {
						const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', newMsg.author.tag);

						const embed = new Discord.RichEmbed()
							.addField(`🗣 ${lang.messagedeleteevent_author}:`, newMsg.author.tag)
							.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${newMsg.channel.name} (${newMsg.channel.id})`)
							.addField(`📥 ${lang.messagereactionaddevent_message}:`, newMsg.cleanContent)
							.setColor('#FF0000')
							.setAuthor(chatfilterembed);

						try {
							await newMsg.guild.channels.get(tableload.chatfilterlogchannel).send({
								embed
							});
						} catch (error) {
							return undefined;
						}
					}
					await newMsg.delete();

					const messagedeleted = lang.messageevent_messagedeleted.replace('%author', newMsg.author);
					newMsg.channel.send(messagedeleted);
				}
			}
		}
	}
};
