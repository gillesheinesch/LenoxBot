const Discord = require('discord.js');
exports.run = async(client, oldMsg, msg) => {
	const tableconfig = client.guildconfs.get(msg.guild.id);

	if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(msg.guild.id, tableconfig);
	}

	var lang = require(`../languages/${tableconfig.language}.json`);
	
    if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply(lang.messageevent_error);

	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableconfig.messageupdatelog === 'true') {
    const messagechannel = client.channels.get(tableconfig.messageupdatelogchannel);
    if (oldMsg.cleanContent !== msg.cleanContent) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.messageupdateevent_updated)
    .addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
    .addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
    .addField(`📎 ${lang.messagedeleteevent_mid}:`, msg.id)
    .addField(`📤 ${lang.messageupdateevent_old}:`, oldMsg.cleanContent.substring(0, 960) + ' ...')
    .addField(`📥 ${lang.messageupdateevent_new}:`, msg.cleanContent.substring(0, 960) + ' ...');
    messagechannel.send({ embed: embed });
	}
}
		const input = msg.content.split(' ').slice();
		if (tableload.chatfilter.chatfilter === 'true' && tableload.chatfilter.array.length !== 0) {
			for (var i = 0; i < tableload.chatfilter.array.length; i++) {
				for (let index = 0; index < input.length; index++) {
					if (input[index].toLowerCase() === tableload.chatfilter.array[i].toLowerCase()) {
						if (tableload.chatfilterlog === 'true') {
							const chatfilterembed = lang.messageevent_chatfilterembed.replace('%authortag', msg.author.tag);
						
							const embed = new Discord.RichEmbed()
							.addField(`🗣 ${lang.messagedeleteevent_author}:`, msg.author.tag)
							.addField(`📲 ${lang.messagedeleteevent_channel}:`, `#${msg.channel.name} (${msg.channel.id})`)
							.addField(`📥 ${lang.messagereactionaddevent_message}:`, msg.cleanContent)
							.setColor('#FF0000')
							.setAuthor(chatfilterembed);
						
							try {
								await msg.guild.channels.get(tableload.chatfilterlogchannel).send({ embed });
							} catch (error) {
								return undefined;
							}
						}
						await msg.delete();
		
						const messagedeleted = lang.messageevent_messagedeleted.replace('%author', msg.author);
						msg.channel.send(messagedeleted);
					}
				}
			}
		}
	}
};
