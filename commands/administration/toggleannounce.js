exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const channelid = msg.channel.id;
	if (tableload.announce === 'false') {
		tableload.announce = 'true';
		tableload.announcechannel = channelid;
		client.guildconfs.set(msg.guild.id, tableload);

		const channelset = lang.toggleannounce_channelset.replace('%channelname', `**#${msg.channel.name}**`);
		return msg.channel.send(channelset);
	}
	tableload.announce = 'false';
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.toggleannounce_channeldeleted);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Announcements',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'toggleannounce',
	description: 'Sets a channel for announcements, where you can use the announce-command',
	usage: 'toggleannounce',
	example: ['toggleannounce'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
