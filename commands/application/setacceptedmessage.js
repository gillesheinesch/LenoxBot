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
	userpermissions: ['ADMINISTRATOR']
};

exports.help = {
	name: 'setacceptedmessage',
	description: 'Sets a custom message that receive the applicants who have been accepted',
	usage: 'setacceptedmessage {message}',
	example: ['setacceptedmessage You have been accepted!'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
