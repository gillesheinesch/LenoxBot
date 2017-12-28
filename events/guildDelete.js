const Discord = require('discord.js');
exports.run = (client, guild) => {
    client.guildconfs.delete(guild.id);
    const embed = new Discord.RichEmbed()
	.setTimestamp()
	.setAuthor(`${guild.name} (${guild.id})`)
	.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
	.setColor('#0066CC')
	.setFooter('Left guild');
	client.channels.get('353989483517181962').send({ embed: embed });

	/* const snekfetch = require('snekfetch');
	snekfetch.post(`https://discordbots.org/api/bots/stats`)
	  .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1NDcxMjMzMzg1MzEzMDc1MiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTA5NjU3MTkzfQ.dDleV67s0ESxSVUxKxeQ8W_z6n9YwrDrF9ObU2MKgVE')
	  .send({ server_count: client.guilds.size })
	  .then(() => console.log('Updated discordbots.org stats.'))
	 .catch(err => console.error(`Whoops something went wrong: ${err.body}`));*/ 
};
