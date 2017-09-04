const Discord = require('discord.js');
exports.run = function(client, msg, args) {
	const tableload = client.guildconfs.get(msg.guild.id);
	const roles = [];
	const embed = new Discord.RichEmbed()
	.setColor('#ABCDEF')
	.setFooter(`You can join a role with the following command: ${tableload.prefix}join {rolename}`);
	try {
		for (var i = 0; i < tableload.selfassignableroles.length; i++) {
			roles.push(msg.guild.roles.get(tableload.selfassignableroles[i]).name);
		}
		embed.addField('Self assignable roles', roles.join("\n"), true);
		return msg.channel.send({ embed: embed });
	} catch (error) {
		msg.channel.send('There are no roles on this server that you can assign yourself!');
	}
	
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'lsar',
	description: 'List alle roles that allows users to assign themselves',
	usage: 'lsar',
	example: 'lsar',
	category: 'utility'
};
