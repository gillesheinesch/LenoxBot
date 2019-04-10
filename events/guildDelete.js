const Discord = require('discord.js');
exports.run = async (client, guild) => {
	if (!client.provider.isReady) return;
	console.log(`${guild} kicked LenoxBot!`);

	const embed = new Discord.RichEmbed()
		.setTimestamp()
		.setAuthor(`${guild.name} (${guild.id})`)
		.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
		.setColor('RED')
		.setFooter('LEFT DISCORD SERVER');
	await client.channels.get('497400159894896651').send({ embed: embed });

	await client.provider.clearGuild(guild.id);
};
