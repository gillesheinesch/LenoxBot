const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const onlinecount = msg.guild.members.array().filter(m => m.presence.status === 'online').length;
	const offlinecount = msg.guild.members.array().filter(m => m.presence.status === 'offline').length;
	const dndcount = msg.guild.members.array().filter(m => m.presence.status === 'dnd').length;
	const afkcount = msg.guild.members.array().filter(m => m.presence.status === 'idle').length;

	const online = lang.memberstatus_online.replace('%memberscount', onlinecount);
	const dnd = lang.memberstatus_dnd.replace('%memberscount', dndcount);
	const afk = lang.memberstatus_afk.replace('%memberscount', afkcount);
	const offline = lang.memberstatus_offline.replace('%memberscount', offlinecount);
	const embed = new Discord.RichEmbed()
		.setDescription(`📲 ${online}\
	\n🔴 ${dnd}\
	\n🕗 ${afk}\
	\n📵 ${offline}`)
		.setColor('#99cc00')
		.setAuthor(msg.guild.name, msg.guild.iconURL);

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Information',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'memberstatus',
	description: `Shows you how many members on this Discord server are AFK, online, offline or busy`,
	usage: 'memberstatus',
	example: ['memberstatus'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
