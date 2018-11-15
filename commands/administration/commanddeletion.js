exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.commanddel === 'false') {
		tableload.commanddel = 'true';
		client.guildconfs.set(msg.guild.id, tableload);

		return msg.channel.send(lang.commanddeletion_deletionset);
	}
	tableload.commanddel = 'false';
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.commanddeletion_nodeletionset);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: ['cmddel'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'commanddeletion',
	description: 'Toggles the deletion of a command after execution',
	usage: 'commanddeletion',
	example: ['commanddeletion'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
};
