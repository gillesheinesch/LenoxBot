const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args, lang) => {
    
};

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
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

