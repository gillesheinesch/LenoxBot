const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	moment.locale(tableload.momentLanguage);

	const uptimeserver = moment.duration(client.uptime).format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`);
	const version = require('../../package.json').version;

	const online = lang.botinfo_online.replace('%guilds', client.guilds.size).replace('%users', client.users.size);
	const embed = new Discord.RichEmbed()
		.setAuthor('LenoxBot', client.user.avatarURL)
		.setColor('#0066CC')
		.setThumbnail(client.user.avatarURL)
		.addField(`⏳ ${lang.botinfo_runtime}`, `${uptimeserver}`)
		.addField(`📡 ${lang.botinfo_stats}`, online)
		.addField(`💻 ${lang.botinfo_website}`, `http://www.lenoxbot.com/`)
		.addField(`💎 ${lang.botinfo_support}`, `https://lenoxbot.com/donate`)
		.addField(`📤 ${lang.botinfo_invite}`, `https://lenoxbot.com/invite/`)
		.addField(`📢 ${lang.botinfo_supportserver}`, 'https://lenoxbot.com/discord/')
		.addField(`🔛 ${lang.botinfo_version}`, version);

	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Information',
	aliases: ['binfo', 'bi'],
	userpermissions: [],
	dashboardsettings: false
};
exports.help = {
	name: 'botinfo',
	description: 'Information about the bot',
	usage: 'botinfo',
	example: ['botinfo'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
