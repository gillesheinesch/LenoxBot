exports.run = (client, msg, args, lang) => {
	const message = lang.ranks_message.replace('%id', msg.guild.id).replace('%guildname', msg.guild.name);
	msg.reply(message);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'XP',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'ranks',
	description: `Ranking list, sorted by points`,
	usage: 'ranks',
	example: ['ranks'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
