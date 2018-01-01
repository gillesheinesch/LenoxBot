const Discord = require('discord.js');
exports.run = (client, oldMember, newMember) => {
	const tableconfig = client.guildconfs.get(newMember.guild.id);
	var lang = require(`../languages/${tableconfig.language}.json`);
	if (tableconfig.presenceupdatelog === 'false') return;

	const messagechannel = client.channels.get(tableconfig.presenceupdatelogchannel);
	if (oldMember.presence.status !== newMember.presence.status) {
	const embed = new Discord.RichEmbed()
	.setColor('#FE2E2E')
	.setTimestamp()
	.setAuthor(lang.presenceupdateevent_changed)
	.addField(`📎 ${lang.presenceupdateevent_member}:`, `${oldMember.user.tag} (${oldMember.id})`)
	.addField(`📤 ${lang.presenceupdateevent_old}:`, oldMember.presence.status)
	.addField(`📥 ${lang.presenceupdateevent_new}:`, newMember.presence.status);
	messagechannel.send({ embed: embed });
}
};
