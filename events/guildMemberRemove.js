const Discord = require('discord.js');
exports.run = (client, member) => {
	if (client.user.id === member.id) return;
	const tableconfig = client.guildconfs.get(member.guild.id);
	if (tableconfig.welcomebye === 'false') return;
	const messagechannel = client.channels.get(tableconfig.welcomebyechannel);
	const embed = new Discord.RichEmbed()
	.setFooter(`User left`)
	.setTimestamp()
	.setColor('#FF0000')
	.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL);
	messagechannel.send({ embed: embed });
};
