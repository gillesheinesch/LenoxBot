const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
exports.run = (client, msg, args) => {
	const servercreated = moment(msg.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');
	const embed = new Discord.RichEmbed()
		.setAuthor(`${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL)
		.setColor('#0066CC')
		.setTimestamp()
		.setThumbnail(msg.guild.iconURL)
		.addField(`🤵 Members`, msg.guild.memberCount)
		.addField(`🗻 Region`, msg.guild.region)
		.addField(`📲 Channels`, msg.guild.channels.size)
		.addField(`⏳ Server created`, servercreated)
		.addField('☑ Verification level', msg.guild.verificationLevel || 'The server has no verification level')
		.addField(`📤 AFK-Channel`, `<#${msg.guild.afkChannelID}>` || 'The server does not have an AFK channel');

	msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['sinfo'],
    userpermissions: []
};
exports.help = {
	name: 'serverinfo',
	description: 'Shows you some information about the current discord server',
	usage: 'serverinfo',
	example: ['serverinfo'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
