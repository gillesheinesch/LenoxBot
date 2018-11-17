exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (tableload.application.status === 'false') {
		tableload.application.status = 'true';
		client.guildconfs.set(msg.guild.id, tableload);

		return msg.channel.send(lang.toggleapplication_activated);
	}
	tableload.application.status = 'false';
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.toggleapplication_disabled);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Settings',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};

exports.help = {
	name: 'toggleapplication',
	description: 'Toggles the applications on or off',
	usage: 'toggleapplication',
	example: ['toggleapplication'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
