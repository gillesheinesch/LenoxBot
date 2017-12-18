const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	const online = msg.guild.members.filterArray(m => m.presence.status === 'online').length;
	const offline = msg.guild.members.filterArray(m => m.presence.status === 'offline').length;
	const dnd = msg.guild.members.filterArray(m => m.presence.status === 'dnd').length;
	const afk = msg.guild.members.filterArray(m => m.presence.status === 'afk').length;

	const embed = new Discord.RichEmbed()
	.setDescription(`📲 ${online} members are online\
	\n🔴 ${dnd} members are busy\
	\n🕗 ${afk} members are afk\
	\n📵 ${offline} members are offline`)
	.setColor('#99cc00')
	.setAuthor(msg.guild.name, msg.guild.iconURL);

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'memberstatus',
	description: `Shows you how many members on this Discord server are AFK, online, offline or busy`,
	usage: 'memberstatus',
	example: ['memberstatus'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
