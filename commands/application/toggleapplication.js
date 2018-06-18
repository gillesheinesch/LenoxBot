const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);

	if (tableload.application.status === 'false') {
		tableload.application.status = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);

        return msg.channel.send(lang.toggleapplication_activated);
	} else {
		tableload.application.status = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.toggleapplication_disabled);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'toggleapplication',
	description: 'Toggles the applications on or off',
	usage: 'toggleapplication',
	example: ['toggleapplication'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
