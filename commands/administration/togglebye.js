exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.bye === 'false') {
		tableload.bye = 'true';
		const channelid = msg.channel.id;
		tableload.byechannel = channelid;

		const channelset = lang.togglebye_channelset.replace('%channelname', msg.channel.name);
		msg.channel.send(channelset);
	} else if (tableload.bye === 'true') {
		tableload.bye = 'false';
		msg.channel.send(lang.togglebye_channeldeleted);
	}
	client.guildconfs.set(msg.guild.id, tableload);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Bye',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};

exports.help = {
	name: 'togglebye',
	description: 'Disable the goodbye message',
	usage: 'togglebye',
	example: ['togglebye'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
