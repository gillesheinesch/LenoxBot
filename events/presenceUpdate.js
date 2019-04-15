const Discord = require('discord.js');
exports.run = (client, oldMember, newMember) => {
	if (!client.provider.isReady) return;
	if (!client.provider.getGuild(newMember.guild.id, 'prefix')) return;

	if (client.provider.getGuild(newMember.guild.id, 'presenceupdatelog') === 'false') return;

	const lang = require(`../languages/${client.provider.getGuild(newMember.guild.id, 'language')}.json`);

	const messagechannel = client.channels.get(client.provider.getGuild(newMember.guild.id, 'presenceupdatelogchannel'));
	if (!messagechannel) return;

	if (oldMember.presence.status !== newMember.presence.status) {
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTimestamp()
			.setAuthor(lang.presenceupdateevent_changed)
			.addField(`📎 ${lang.presenceupdateevent_member}:`, `${oldMember.user.tag} (${oldMember.id})`)
			.addField(`📤 ${lang.presenceupdateevent_old}:`, oldMember.presence.status)
			.addField(`📥 ${lang.presenceupdateevent_new}:`, newMember.presence.status);
		messagechannel.send({ embed: embed });
	}
};
