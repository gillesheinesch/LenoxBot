const Discord = require('discord.js');
exports.run = (client, channel) => {
	if (!channel) return;
	if (channel.type !== 'text') return;
	if (!client.provider.isReady) return;

	if (!client.provider.getGuild(channel.guild.id, 'prefix')) return;
	if (client.provider.getGuild(channel.guild.id, 'channeldeletelog') === 'false') return;

	const langSet = client.provider.getGuild(channel.guild.id, 'language');
	const lang = require(`../languages/${langSet}.json`);

	const messagechannel = client.channels.get(client.provider.getGuild(channel.guild.id, 'channeldeletelogchannel'));
	if (!messagechannel) return;

	const embed = new Discord.RichEmbed()
		.setColor('RED')
		.setTimestamp()
		.setAuthor(lang.channeldeleteevent_channeldeleted)
		.addField(`📎 ${lang.channelcreateevent_channelid}:`, channel.id)
		.addField(`📝 ${lang.channelcreateevent_name}:`, channel.name);
	messagechannel.send({ embed: embed });
};
