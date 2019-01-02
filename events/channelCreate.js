const Discord = require('discord.js');
exports.run = (client, channel) => {
	if (!channel) return;
	if (channel.type !== 'text') return;

	const tableload = client.guildconfs.get(channel.guild.id);
	if (!tableload) return;
	if (tableload.channelcreatelog === 'false') return;

	if (tableload.language === '') {
		tableload.language = 'en-US';
		client.guildconfs.set(channel.guild.id, tableload);
	}

	// CHANGE TO THE NEW CROWDIN SYSTEM
	if (tableload.language === 'en') {
		tableload.language = 'en-US';
		client.guildconfs.set(channel.guild.id, tableload);
	}

	if (tableload.language === 'ge') {
		tableload.language = 'de-DE';
		client.guildconfs.set(channel.guild.id, tableload);
	}

	if (tableload.language === 'fr') {
		tableload.language = 'fr-FR';
		client.guildconfs.set(channel.guild.id, tableload);
	}
	// CHANGE TO THE NEW CROWDIN SYSTEM

	const lang = require(`../languages/${tableload.language}.json`);

	const messagechannel = client.channels.get(tableload.channelcreatelogchannel);
	if (!messagechannel) return;

	const embed = new Discord.RichEmbed()
		.setColor('GREEN')
		.setTimestamp()
		.setAuthor(lang.channelcreateevent_channelcreated)
		.addField(`📎 ${lang.channelcreateevent_channelid}:`, channel.id)
		.addField(`📝 ${lang.channelcreateevent_name}`, channel.name);
	messagechannel.send({
		embed: embed
	});
};
