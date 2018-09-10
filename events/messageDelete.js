const Discord = require('discord.js');
exports.run = (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return;

	const tableload = client.guildconfs.get(msg.guild.id);
	if (!tableload) return;

	if (tableload.messagedellog === 'false') return;
	const messagechannel = client.channels.get(tableload.messagedellogchannel);

	if (tableload.language === '') {
		tableload.language = 'en-US';
		client.guildconfs.set(msg.id, tableload);
	}

	const lang = require(`../languages/${tableload.language}.json`);

	const embed = new Discord.RichEmbed()
		.setColor('#FE2E2E')
		.setTimestamp()
		.setAuthor(lang.messagedeleteevent_deleted)
		.addField(`🗣 ${lang.messagedeleteevent_author}`, msg.author.tag)
		.addField(`📲 ${lang.messagedeleteevent_channel}`, `${msg.channel.name} (${msg.channel.id})`)
		.addField(`📎 ${lang.messagedeleteevent_mid}`, msg.id)
		.addField(`📜 ${lang.messagedeleteevent_message}`, msg.cleanContent.length >= 1 ? msg.cleanContent : '-');

	messagechannel.send({ embed: embed });
};
