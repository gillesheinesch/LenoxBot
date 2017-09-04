const Discord = require('discord.js');
exports.run = (client, guild) => {
    client.guildconfs.delete(guild.id);
    const embed = new Discord.RichEmbed()
	.setTimestamp()
	.setAuthor(`${guild.name} (${guild.id})`)
	.setColor('#0066CC')
	.setFooter('Joined guild');
	client.channels.get('353989483517181962').send({ embed: embed });
};
