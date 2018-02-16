const Discord = require('discord.js');
exports.run = async(client, oldMember, newMember) => {
	const tableconfig = await client.guildconfs.get(newMember.guild.id);

	if (!tableconfig) return undefined;

	if (tableconfig.presenceupdatelog === 'false') return;

	if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(newMember.guild.id, tableconfig);
	}
	
	var lang = require(`../languages/${tableconfig.language}.json`);

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
