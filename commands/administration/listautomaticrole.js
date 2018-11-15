const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const roles = [];
	const points = [];

	if (!tableload.ara) {
		tableload.ara = [];
		client.guildconfs.set(msg.guild.id, tableload);
	}

	const embed = new Discord.RichEmbed()
		.setColor('#ABCDEF');

	try {
		for (let i = 0; i < tableload.ara.length; i += 2) {
			roles.push(msg.guild.roles.get(tableload.ara[i]).name);
		}
		embed.addField(lang.listautomaticrole_embed, roles.join('\n'), true);

		for (let i = 1; i < tableload.ara.length; i += 2) {
			points.push(tableload.ara[i]);
		}
		embed.addField(lang.listautomaticrole_points, points.join('\n'), true);
		return msg.channel.send({ embed: embed });
	} catch (error) {
		return msg.channel.send(lang.listautomaticrole_error);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Automaticroles',
	aliases: ['lar'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'listautomaticrole',
	description: 'Lists all auto assignable roles',
	usage: 'listautomaticrole',
	example: ['listautomaticrole'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
