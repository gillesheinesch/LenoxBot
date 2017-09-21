exports.run = (client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));	
	
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(" ");
	if (!content) return msg.channel.send('You must enter your bye message!');
	tableload.byemsg = content;
	client.guildconfs.set(msg.guild.id, tableload);
	msg.channel.send('Goodbye message saved successfully!');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};

exports.help = {
	name: 'byemsg',
	description: 'Sets a goodbye message to say goodbye to your users',
	usage: 'byemsg {bye msg}',
	example: 'byemsg Bye $user$, we gonna miss you on the $servername$ discord-server!',
	category: 'administration'
};
