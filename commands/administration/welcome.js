exports.run = async(client, msg, args) => {    
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.welcome === 'false') {
		tableload.welcome = 'true';
	
		const channelid = msg.channel.id;
		tableload.welcomechannel = channelid;
	
		msg.channel.send(`Your new users are now welcomed in **${msg.channel.name}**!`);
	} else if (tableload.welcome === 'true') {
		tableload.welcome = 'false';
		msg.channel.send('The welcome message is now disabled!');
	}
	await client.guildconfs.set(msg.guild.id, tableload);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: ['ADMINISTRATOR']
};

exports.help = {
	name: 'welcome',
	description: 'Toggles the welcome message in this channel',
	usage: 'welcome',
	example: ['welcome'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
