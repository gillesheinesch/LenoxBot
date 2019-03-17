const Discord = require('discord.js');
exports.run = (client, oldRole, newRole) => {
	if (!client.provider.isReady) return;
	if (!client.provider.getGuild(oldRole.guild.id, 'prefix')) return;

	if (client.provider.getGuild(oldRole.guild.id, 'rolecreatelog') === 'false') return;

	const lang = require(`../languages/${client.provider.getGuild(oldRole.guild.id, 'language')}.json`);

	const messagechannel = client.channels.get(client.provider.getGuild(oldRole.guild.id, 'rolecreatelogchannel'));
	if (!messagechannel) return;

	if (oldRole.name !== newRole.name) {
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTimestamp()
			.setAuthor(lang.roleupdateevent_nameupdated)
			.addField(`📎 ${lang.rolecreateevent_id}:`, oldRole.id)
			.addField(`📤 ${lang.roleupdateevent_oldname}:`, oldRole.name)
			.addField(`📥 ${lang.roleupdateevent_newname}:`, newRole.name);
		return messagechannel.send({ embed: embed });
	}
	if (oldRole.hexColor !== newRole.hexColor) {
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTimestamp()
			.setAuthor(lang.roleupdateevent_rolecolorupdated)
			.addField(`⚙ ${lang.rolecreateevent_rolename}:`, oldRole.name)
			.addField(`📎 ${lang.rolecreateevent_id}:`, oldRole.id)
			.addField(`📤${lang.roleupdateevent_oldcolor}:`, oldRole.hexColor)
			.addField(`📥 ${lang.roleupdateevent_newcolor}:`, newRole.hexColor);
		return messagechannel.send({ embed: embed });
	}
	if (oldRole.position !== newRole.position) {
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTimestamp()
			.setAuthor(lang.roleupdateevent_positionupdated)
			.addField(`⚙ ${lang.rolecreateevent_rolename}:`, oldRole.name)
			.addField(`📎 ${lang.rolecreateevent_id}:`, oldRole.id)
			.addField(`📤 ${lang.roleupdateevent_old}:`, oldRole.position)
			.addField(`📥 ${lang.roleupdateevent_new}:`, newRole.position);
		return messagechannel.send({ embed: embed });
	}
};
