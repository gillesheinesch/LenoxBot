const Discord = require('discord.js');
module.exports = {
	run: (role) => {
		if (!client.provider.isReady) return;
		if (!client.provider.getGuild(role.guild.id, 'prefix')) return;

		for (let i = 0; i < client.provider.getGuild(role.guild.id, 'selfassignableroles').length; i += 1) {
			if (role.id === client.provider.getGuild(role.guild.id, 'selfassignableroles')[i]) {
				const currentSelfassignableroles = client.provider.getGuild(role.guild.id, 'selfassignableroles');
				currentSelfassignableroles.splice(i, 1);
				return client.provider.setGuild(role.guild.id, 'selfassignableroles', currentSelfassignableroles);
			}
		}
		if (role.name === 'LenoxBot') return;
		if (client.provider.getGuild(role.guild.id, 'roledeletelog') === 'false') return;

		const lang = require(`../languages/${client.provider.getGuild(role.guild.id, 'language')}.json`);

		const messagechannel = client.channels.get(client.provider.getGuild(role.guild.id, 'roledeletelogchannel'));
		if (!messagechannel) return;

		const embed = new Discord.MessageEmbed()
			.setColor('RED')
			.setTimestamp()
			.setAuthor(lang.roledeleteevent_deleted)
			.addField(`📎 ${lang.rolecreateevent_id}:`, role.id)
			.addField(`🔰 ${lang.rolecreateevent_color}:`, role.hexColor)
			.addField(`📝 ${lang.rolecreateevent_name}:`, role.name);
		messagechannel.send({ embed: embed });
	}
};
