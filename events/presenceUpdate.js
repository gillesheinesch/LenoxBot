const Discord = require('discord.js');
exports.run = (client, oldMember, newMember) => {
	const tableconfig = client.guildconfs.get(newMember.guild.id);
	if (tableconfig.presenceupdatelog === 'false') return;

	const messagechannel = client.channels.get(tableconfig.presenceupdatelogchannel);
	if (oldMember.presence.status !== newMember.presence.status) {
	const embed = new Discord.RichEmbed()
	.setColor('#FE2E2E')
	.setTimestamp()
	.setAuthor('Presence changed!')
	.addField(`📎 Member:`, `${oldMember.user.tag} (${oldMember.id})`)
	.addField(`📤 Old Presence:`, oldMember.presence.status)
	.addField(`📥 New Presence:`, newMember.presence.status);
	messagechannel.send({ embed: embed });
}
};
