const Discord = require('discord.js');
exports.run = async(client, oldMember, newMember) => {
	const tableconfig = client.guildconfs.get(newMember.guild.id);

if (oldMember.nickname !== newMember.nickname) {
	if (!tableconfig.nicknamelog) {
		tableconfig.nicknamelog = [];
		await client.guildconfs.set(newMember.guild.id, tableconfig);
	}

	tableconfig.nicknamelog.push(newMember.id);
	tableconfig.nicknamelog.push(oldMember.nickname === null ? 'No nickname' : oldMember.nickname);
	tableconfig.nicknamelog.push(newMember.nickname === null ? 'No nickname' : newMember.nickname);
	tableconfig.nicknamelog.push(new Date().getTime());
	await client.guildconfs.set(newMember.id, tableconfig);
}
	if (tableconfig.guildmemberupdatelog === 'false') return;

	const messagechannel = client.channels.get(tableconfig.guildmemberupdatelogchannel);

if (oldMember.nickname !== newMember.nickname) {
	const embed = new Discord.RichEmbed()
	.setColor('#FE2E2E')
	.setTimestamp()
	.setAuthor('Nickname changed!')
	.addField(`📎 Member:`, `${oldMember.user.tag} (${oldMember.id})`)
	.addField(`📤 Old Nickname:`, oldMember.nickname === null ? 'The member had no nickname' : oldMember.nickname)
	.addField(`📥 New Nickname:`, newMember.nickname === null ? 'The nickname has been reset' : newMember.nickname);
	messagechannel.send({ embed: embed });
}


if (oldMember.roles.size < newMember.roles.size) {
	const embed = new Discord.RichEmbed()
	.setColor('#FE2E2E')
	.setTimestamp()
	.setAuthor('Role assigned!')
	.addField(`📎 Member:`, `${oldMember.user.tag} (${oldMember.id})`);
	for(const role of newMember.roles.map(x => x.id)) {
		if (!oldMember.roles.has(role)) {
			embed.addField(`📥 Role:`, `${oldMember.guild.roles.get(role).name}`);
		}
	}
		messagechannel.send({ embed });
}

if (oldMember.roles.size > newMember.roles.size) {
	const embed = new Discord.RichEmbed()
	.setColor('#FE2E2E')
	.setTimestamp()
	.setAuthor('Role removed!')
	.addField(`📎 Member:`, `${oldMember.user.tag} (${oldMember.id})`);
	for(const role of oldMember.roles.map(x => x.id)) {
		if (!newMember.roles.has(role)) {
			embed.addField(`📥 Role:`, `${oldMember.guild.roles.get(role).name}`);
		}
	}
		messagechannel.send({ embed });
}
};
