const Discord = require('discord.js');
exports.run = async (client, guild) => {
	client.guildconfs.delete(guild.id);
	const embed = new Discord.RichEmbed()
		.setTimestamp()
		.setAuthor(`${guild.name} (${guild.id})`)
		.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
		.setColor('RED')
		.setFooter('LEFT DISCORD SERVER');
	await client.channels.get('497400159894896651').send({ embed: embed });
};
