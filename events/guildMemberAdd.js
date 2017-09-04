const Discord = require('discord.js');
exports.run = (client, member) => {
	const tableconfig = client.guildconfs.get(member.guild.id);
	if (tableconfig.welcomebye === 'false') return;
	const messagechannel = client.channels.get(tableconfig.welcomebyechannel);
	const embed = new Discord.RichEmbed()
	.setFooter(`User joined`)
	.setTimestamp()
	.setColor(0x00AE86)
	.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL);
	messagechannel.send({ embed: embed });
};
