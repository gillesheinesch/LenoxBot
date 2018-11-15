exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.welcome === 'false') {
		tableload.welcome = 'true';

		const channelid = msg.channel.id;
		tableload.welcomechannel = channelid;

		const channelset = lang.togglewelcome_channelset.replace('%channelname', `#**${msg.channel.name}**`);
		msg.channel.send(channelset);
	} else if (tableload.welcome === 'true') {
		tableload.welcome = 'false';
		msg.channel.send(lang.togglewelcome_channeldeleted);
	}
	client.guildconfs.set(msg.guild.id, tableload);
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
	name: 'togglewelcome',
	description: 'Toggles the welcome message in this channel',
	usage: 'togglewelcome',
	example: ['togglewelcome'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
