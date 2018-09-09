exports.run = (client, msg) => {
	const rf = require('random-facts');
	msg.channel.send(rf.randomFact());
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'randomfact',
	description: 'Random facts (in English only)',
	usage: 'randomfact',
	example: ['randomfact'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
