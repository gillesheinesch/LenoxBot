exports.run = async(client, msg, args, lang) => {	
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(" ");
	if (!content) return msg.channel.send(lang.byemsg_noinput);
	tableload.byemsg = content;
	await client.guildconfs.set(msg.guild.id, tableload);
	
	return msg.channel.send(lang.byemsg_goodbyemsgset);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
};

exports.help = {
	name: 'byemsg',
	description: 'Sets a goodbye message to say goodbye to your users',
	usage: 'byemsg {bye msg}',
	example: ['byemsg Bye $user$, we gonna miss you on the $servername$ discord-server!'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
