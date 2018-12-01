const Discord = require('discord.js');
exports.run = (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return;

	const tableload = client.guildconfs.get(msg.guild.id);
	if (!tableload) return;

	if (tableload.messagedellog === 'false') return;
	const messagechannel = client.channels.get(tableload.messagedellogchannel);

	if (!messagechannel) return;

	if (tableload.language === '') {
		tableload.language = 'en-US';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	// CHANGE TO THE NEW CROWDIN SYSTEM
	if (tableload.language === 'en') {
		tableload.language = 'en-US';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.language === 'ge') {
		tableload.language = 'de-DE';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.language === 'fr') {
		tableload.language = 'fr-FR';
		client.guildconfs.set(msg.guild.id, tableload);
	}
	// CHANGE TO THE NEW CROWDIN SYSTEM

	const lang = require(`../languages/${tableload.language}.json`);

	const embed = new Discord.RichEmbed()
		.setColor('RED')
		.setTimestamp()
		.setAuthor(lang.messagedeleteevent_deleted)
		.addField(`🗣 ${lang.messagedeleteevent_author}`, msg.author.tag)
		.addField(`📲 ${lang.messagedeleteevent_channel}`, `${msg.channel.name} (${msg.channel.id})`)
		.addField(`📎 ${lang.messagedeleteevent_mid}`, msg.id)
		.addField(`📜 ${lang.messagedeleteevent_message}`, msg.cleanContent.length >= 1 ? msg.cleanContent.substring(0, 960) : '-');

	messagechannel.send({ embed: embed });
};
