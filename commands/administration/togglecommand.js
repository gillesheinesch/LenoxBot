exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (args.slice().length === 0) return msg.reply(lang.togglecommand_noinput);

	/* eslint no-else-return: 0 */
	for (const x in tableload.commands) {
		if (x.toLowerCase() === args.slice().join(' ').toLowerCase()) {
			if (client.commands.get(x.toLowerCase()).conf.dashboardsettings === false) return msg.reply(lang.togglecommand_notchangeable);
			if (tableload.commands[x.toLowerCase()].status === 'true') {
				tableload.commands[x.toLowerCase()].status = 'false';
				client.guildconfs.set(msg.guild.id, tableload);
				return msg.reply(lang.togglecommand_settofalse);
			} else {
				tableload.commands[x.toLowerCase()].status = 'true';
				client.guildconfs.set(msg.guild.id, tableload);
				return msg.reply(lang.togglecommand_settotrue);
			}
		}
	}
	return msg.reply(lang.togglecommand_nocommand);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};

exports.help = {
	name: 'togglecommand',
	description: 'Toggles the status of a command',
	usage: 'togglecommand {name of the command}',
	example: ['togglecommand ban', 'togglecommand kick'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
