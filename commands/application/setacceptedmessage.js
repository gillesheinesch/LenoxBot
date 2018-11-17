exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(' ');
	if (!content) return msg.channel.send(lang.setacceptedmessage_noinput);

	tableload.application.acceptedmessage = content;
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
	name: 'setacceptedmessage',
	description: 'Sets a custom message that receive the applicants who have been accepted',
	usage: 'setacceptedmessage {custom message}',
	example: ['setacceptedmessage You have been accepted!'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
