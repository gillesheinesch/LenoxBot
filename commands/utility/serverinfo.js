const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	moment.locale(tableload.momentLanguage);

	const servercreated = moment(msg.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');

	const emojis = [];
	if (msg.guild.emojis.size !== 0) {
		msg.guild.emojis.forEach(r => {
			const emoji = client.emojis.get(r.id);
			emojis.push(emoji);
		});
	}

	const emojisembed = [];
	if (emojis.length === 0) {
		emojisembed.push(lang.serverinfo_emojisnone);
	} else if (emojis.join(' ').length > 1020) {
		let emojislength = '';
		let status = false;

		for (let i = 0; i < emojis.length; i++) {
			if (emojislength.length > 1020 && status === false) {
				status = true;
				for (let index = 0; index < i - 2; index++) {
					emojisembed.push(emojis[index]);
				}
			}
			emojislength += emojis[i];
		}
		emojisembed.push('...');
	} else {
		emojisembed.push(emojis.join(' '));
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
		.addField(`📤 ${lang.serverinfo_afkchannel}`, msg.guild.afkChannel === null ? lang.serverinfo_noafkchannel : msg.guild.afkChannel.name)
		.addField(`🎊 ${lang.serverinfo_emojis}`, emojisembed.join(' '));

	msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Information',
	aliases: ['sinfo', 'si'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'serverinfo',
	description: 'Shows you some information about the current discord server',
	usage: 'serverinfo',
	example: ['serverinfo'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
