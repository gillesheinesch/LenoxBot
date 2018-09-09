const Discord = require('discord.js');

exports.run = (client, msg, args, lang) => {
	if (msg.channel.topic === null || msg.channel.topic === '') return msg.channel.send(lang.channeltopic_error);

	const embed = new Discord.RichEmbed()
		.setColor('#99ff99')
		.setDescription(`${lang.channeltopic_embed} \n\n${msg.channel.topic}`)
		.setAuthor(`${msg.channel.name} (${msg.channel.id})`);

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Information',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'channeltopic',
	description: 'Shows you the channel topic of the current channel if one exists',
	usage: 'channeltopic',
	example: ['channeltopic'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
