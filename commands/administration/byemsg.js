exports.run = async(client, msg, args) => {	
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(" ");
	if (!content) return msg.channel.send('You must enter your bye message!');
	tableload.byemsg = content;
	await client.guildconfs.set(msg.guild.id, tableload);
	
	return msg.channel.send('Goodbye message saved successfully!');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};

exports.help = {
	name: 'byemsg',
	description: 'Sets a goodbye message to say goodbye to your users',
	usage: 'byemsg {bye msg}',
	example: 'byemsg Bye $user$, we gonna miss you on the $servername$ discord-server!',
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
