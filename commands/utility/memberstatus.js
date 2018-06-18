const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const onlinecount = msg.guild.members.filterArray(m => m.presence.status === 'online').length;
	const offlinecount = msg.guild.members.filterArray(m => m.presence.status === 'offline').length;
	const dndcount = msg.guild.members.filterArray(m => m.presence.status === 'dnd').length;
	const afkcount = msg.guild.members.filterArray(m => m.presence.status === 'idle').length;

	var online = lang.memberstatus_online.replace('%memberscount', onlinecount);
	var dnd = lang.memberstatus_dnd.replace('%memberscount', dndcount);
	var afk = lang.memberstatus_afk.replace('%memberscount', afkcount);
	var offline = lang.memberstatus_offline.replace('%memberscount', offlinecount);
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
	aliases: [],
	userpermissions: [], dashboardsettings: true
};
exports.help = {
	name: 'memberstatus',
	description: `Shows you how many members on this Discord server are AFK, online, offline or busy`,
	usage: 'memberstatus',
	example: ['memberstatus'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
