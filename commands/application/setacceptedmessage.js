exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(" ");
	if (!content) return msg.channel.send(lang.setacceptedmessage_noinput);

	tableload.application.acceptedmessage = content;
	await client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.setacceptedmessage_set);
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
	name: 'setacceptedmessage',
	description: 'Sets a custom message that receive the applicants who have been accepted',
	usage: 'setacceptedmessage {message}',
	example: ['setacceptedmessage You have been accepted!'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
