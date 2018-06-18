const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args, lang) => {
    
};

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
	userpermissions: [],
=======
	userpermissions: [], dashboardsettings: true,
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
	cooldown: 86400000
};
exports.help = {
	name: 'transferitem',
	description: 'Get your daily reward or give it away to another discord user',
	usage: 'daily [@User]',
	example: ['daily', 'daily @Tester#3873'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};

