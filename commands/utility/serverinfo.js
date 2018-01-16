const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
exports.run = (client, msg, args, lang) => {
	const servercreated = moment(msg.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');

	var emojis = [];
	if (msg.guild.emojis.size !== 0) {
		msg.guild.emojis.forEach(r => {
			const emoji = client.emojis.get(r.id);
			emojis.push(emoji);
		});
	}

	const embed = new Discord.RichEmbed()
		.setAuthor(`${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL)
		.setColor('#0066CC')
		.setTimestamp()
		.setThumbnail(msg.guild.iconURL)
		.addField(`🤵 ${lang.serverinfo_members}`, msg.guild.memberCount)
		.addField(`🗻 ${lang.serverinfo_region}`, msg.guild.region)
		.addField(`📲 ${lang.serverinfo_channels}`, msg.guild.channels.size)
		.addField(`⏳ ${lang.serverinfo_created}`, servercreated)
		.addField(`☑ ${lang.serverinfo_verification}`, msg.guild.verificationLevel || lang.serverinfo_noverification)
		.addField(`📤 ${lang.serverinfo_afkchannel}`, `<#${msg.guild.afkChannelID}>` || lang.serverinfo_noafkchannel)
		.addField(`🎊 ${lang.serverinfo_emojis}`, emojis.length === 0 ? lang.serverinfo_emojisnone : emojis.join(" "));

	msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['sinfo', 'si'],
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
