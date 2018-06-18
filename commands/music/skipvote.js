exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.skipvote) {
		tableload.skipvote = 'false';
		await client.guildconfs.set(msg.guild, tableload);
		
	}

	if (tableload.skipvote === 'false') {
		tableload.skipvote = 'true';

		var activated = lang.skipvote_activated.replace('%prefix', tableload.prefix);
		msg.channel.send(activated);
		return client.guildconfs.set(msg.guild, tableload);
	} else {
		tableload.skipvote = 'false';
		msg.channel.send(lang.skipvote_disabled);
		return client.guildconfs.set(msg.guild, tableload);
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
	name: 'skipvote',
	description: 'Toggles the skipvote function',
	usage: 'skipvote',
	example: ['skipvote'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
