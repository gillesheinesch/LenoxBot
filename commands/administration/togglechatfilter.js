exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.chatfilter) {
		tableload.chatfilter = {
			chatfilter: 'false',
			array: []
		};
		client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.chatfilter.chatfilter === 'false') {
		tableload.chatfilter.chatfilter = 'true';
		client.guildconfs.set(msg.guild.id, tableload);

		return msg.channel.send(lang.togglechatfilter_activated);
	}
	tableload.chatfilter.chatfilter = 'false';
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.togglechatfilter_disabled);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Chatfilter',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'togglechatfilter',
	description: 'Set the chat filter on or off',
	usage: 'togglechatfilter',
	example: ['togglechatfilter'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
