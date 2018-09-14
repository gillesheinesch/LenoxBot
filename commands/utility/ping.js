exports.run = async (client, msg, args, lang) => {
	const newmsg = lang.ping_ping.replace('%timestamp', Date.now() - msg.createdTimestamp);
	msg.channel.send(newmsg);
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
	name: 'ping',
	description: 'Shows you how long the bot needs to send a message',
	usage: 'ping',
	example: ['ping'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
