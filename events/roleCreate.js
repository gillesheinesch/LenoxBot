const Discord = require('discord.js');
exports.run = (client, role) => {
	if (!client.provider.isReady) return;
	if (!client.provider.getGuild(role.guild.id, 'prefix')) return;
	if (client.provider.getGuild(role.guild.id, 'rolecreatelog') === 'false') return;

	const lang = require(`../languages/${client.provider.getGuild(role.guild.id, 'language')}.json`);

	const messagechannel = client.channels.get(client.provider.getGuild(role.guild.id, 'rolecreatelogchannel'));
	if (!messagechannel) return;

	const embed = new Discord.RichEmbed()
		.setColor('GREEN')
		.setTimestamp()
		.setAuthor(lang.rolecreateevent_created)
		.addField(`📎 ${lang.rolecreateevent_id}:`, role.id)
		.addField(`🔰 ${lang.rolecreateevent_color}:`, role.hexColor)
		.addField(`📝 ${lang.rolecreateevent_name}:`, role.name);
	messagechannel.send({ embed: embed });
};
