const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    const embed = new Discord.RichEmbed()
    .setColor('0066CC')
    .setDescription('► modlog \n► messagedelete \n► messageupdate \n► channelupdate \n► channelcreate \n► channeldelete \n► memberupdate \n► presenceupdate \n► rolecreate \n► roledelete \n► roleupdate \n► userjoin \n► userleft \n► guildupdate')
    .setAuthor('List of all events');
    msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['MANAGE_GUILD']
};
exports.help = {
	name: 'listevents',
	description: 'Lists you all events that you can log on your server',
	usage: 'listevents',
	example: 'listevents',
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
