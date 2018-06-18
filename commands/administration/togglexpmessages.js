const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    
    if (!tableload.xpmessages) {
        tableload.xpmessages = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.xpmessages === 'false') {
		tableload.xpmessages = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);

		return msg.channel.send(lang.togglexpmessages_set);
	} else {
		tableload.xpmessages = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.togglexpmessages_deleted);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
};
exports.help = {
	name: 'togglexpmessages',
	description: 'Set the xp messages on or off',
	usage: 'togglexpmessages',
	example: ['togglexpmessages'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
