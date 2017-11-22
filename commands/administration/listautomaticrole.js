const Discord = require('discord.js');
exports.run = function(client, msg, args) {
	const tableload = client.guildconfs.get(msg.guild.id);
    const roles = [];
    const points = [];

	const embed = new Discord.RichEmbed()
    .setColor('#ABCDEF');

	try {
		for (var i = 0; i < tableload.ara.length; i += 2) {
			roles.push(msg.guild.roles.get(tableload.ara[i]).name);
		}
        embed.addField('Automatic assignable roles', roles.join("\n"), true);
        
        for (var i = 1; i < tableload.ara.length; i += 2) {
			points.push(tableload.ara[i]);
        }
        embed.addField('Points', points.join("\n"), true);
		return msg.channel.send({ embed: embed });
	} catch (error) {
		return msg.channel.send('There are no roles, that can be gotten by a certain amount of points until now');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['lar'],
    userpermissions: ['ADMINISTRATION']
};
exports.help = {
	name: 'listautomaticrole',
	description: 'Lists all auto assignable roles',
	usage: 'listautomaticrole',
	example: 'listautomaticrole',
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
