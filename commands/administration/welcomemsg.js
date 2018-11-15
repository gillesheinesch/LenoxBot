exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(' ');

	if (!content) return msg.channel.send(lang.welcomemsg_error);

	tableload.welcomemsg = content;
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.welcomemsg_set);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Welcome',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};

exports.help = {
	name: 'welcomemsg',
	description: 'Sets a welcome message to greet your users',
	usage: 'welcomemsg {welcome msg}',
	example: ['welcomemsg Hello $username$, welcome on the $servername$ discord-server!'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
