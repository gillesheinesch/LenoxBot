const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    
    if (!tableload.chatfilter) {
		tableload.chatfilter = {
			chatfilter: 'false',
			array: []
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.chatfilter.chatfilter === 'false') {
		tableload.chatfilter.chatfilter = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);

		return msg.channel.send(lang.togglechatfilter_activated);
	} else {
		tableload.chatfilter.chatfilter = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.togglechatfilter_disabled);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],


    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true

};
exports.help = {
	name: 'togglechatfilter',
	description: 'Set the chat filter on or off',
	usage: 'togglechatfilter',
	example: ['togglechatfilter'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
