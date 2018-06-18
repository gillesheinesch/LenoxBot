const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],

    

    userpermissions: [], dashboardsettings: true

};
exports.help = {
	name: 'reputation',
	description: 'Create an embed for you with any text. Use // to go to a new line',
	usage: 'embed {text}',
	example: ['embed Welcome on this discord server! Here is a list of all rules on this discord server...'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};

