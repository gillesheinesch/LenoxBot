exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(' ');
	if (!content) return msg.channel.send(lang.setacceptedmessage_noinput);

	tableload.application.rejectedmessage = content;
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.setacceptedmessage_set);
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
	name: 'setrejectedmessage',
	description: 'Sets a custom message that receive the applicants who have been rejected',
	usage: 'setrejectedmessage {custom message}',
	example: ['setrejectedmessage You have been rejected!'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
