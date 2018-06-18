exports.run = async(client, msg, args, lang) => {    
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.welcome === 'false') {
		tableload.welcome = 'true';
	
		const channelid = msg.channel.id;
		tableload.welcomechannel = channelid;
	
		var channelset = lang.welcome_channelset.replace('%channelname', `#**${msg.channel.name}**`);
		msg.channel.send(channelset);
	} else if (tableload.welcome === 'true') {
		tableload.welcome = 'false';
		msg.channel.send(lang.welcome_channeldeleted);
	}
	await client.guildconfs.set(msg.guild.id, tableload);
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
	name: 'welcome',
	description: 'Toggles the welcome message in this channel',
	usage: 'welcome',
	example: ['welcome'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
