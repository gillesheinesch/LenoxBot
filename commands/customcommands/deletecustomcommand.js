exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (args.slice(0).length === 0) return msg.reply(lang.deletecustomcommand_noinput);

	for (let i = 0; i < tableload.customcommands.length; i++) {
		if (tableload.customcommands[i].name.toLowerCase() === args.slice(0).join(' ').toLowerCase()) {
			tableload.customcommands.splice(i, 1);
			client.guildconfs.set(msg.guild.id, tableload);

			return msg.reply(lang.deletecustomcommand_deleted);
		}
	}
	return msg.reply(lang.deletecustomcommand_notexists);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Customcommands',
	aliases: ['dcc'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'deletecustomcommand',
	description: 'Deletes a custom command',
	usage: 'deletecustomcommand {name of the custom command}',
	example: ['deletecustomcommand test221'],
	category: 'customcommands',
	botpermissions: ['SEND_MESSAGES']
};
