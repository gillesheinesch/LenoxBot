const Discord = require('discord.js');

exports.run = (client, msg, args, lang) => {
    var rf = require('random-facts');
    msg.channel.send(rf.randomFact());
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
    userpermissions: []
=======
    userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'randomfact',
	description: 'Random facts (in English only)',
	usage: 'randomfact',
	example: ['randomfact'],
	category: 'searches',
    botpermissions: ['SEND_MESSAGES']
};
