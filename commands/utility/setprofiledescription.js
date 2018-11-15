exports.run = (client, msg, args, lang) => {
	const tableload = client.userdb.get(msg.author.id);
	const userdb = client.userdb.get(msg.author.id);
	const input = args.slice();

	if (!input || input.length === 0) return msg.reply(lang.setprofiledescription_noinput);
	if (input.join(' ').length > 100 && userdb.premium.status === false) return msg.reply(lang.setprofiledescription_error);
	if (input.join(' ').length > 400) return msg.reply(lang.setprofiledescription_error2);

	tableload.description = input.join(' ');
	client.userdb.set(msg.author.id, tableload);

	msg.channel.send(lang.setprofiledescription_set);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Settings',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'setprofiledescription',
	description: 'Sets a global profile description',
	usage: 'setprofiledescription {description}',
	example: ['setprofiledescription 27y/o | Love Lenoxbot | pilot at American Airline'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
