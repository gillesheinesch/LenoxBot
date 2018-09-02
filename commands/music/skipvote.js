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
	shortDescription: "Skip",
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'skipvote',
	description: 'Toggles the skipvote function',
	usage: 'skipvote',
	example: ['skipvote'],
	category: 'music',
    botpermissions: ['SEND_MESSAGES']
};
