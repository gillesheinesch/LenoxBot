const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	return msg.reply(`New ticket can be created under https://lenoxbot.com/newticket/${msg.guild.id}`);
};


exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'ticketlink',
	description: '',
	usage: '',
	example: [],
	category: 'tickets',
    botpermissions: ['SEND_MESSAGES']
};
