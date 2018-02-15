const Discord = require('discord.js');
exports.run = async(client, guild) => {
    await client.guildconfs.delete(guild.id);
    const embed = new Discord.RichEmbed()
	.setTimestamp()
	.setAuthor(`${guild.name} (${guild.id})`)
	.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
	.setColor('#0066CC')
	.setFooter('Left guild');
	client.channels.get('353989483517181962').send({ embed: embed });
};
