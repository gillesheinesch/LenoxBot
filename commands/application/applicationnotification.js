exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const channelid = msg.channel.id;
	if (tableload.application.notificationstatus === false) {
		tableload.application.notificationstatus = true;
		tableload.application.notificationchannel = channelid;
		client.guildconfs.set(msg.guild.id, tableload);

		const channelset = lang.applicationnotification_channelset.replace('%channelname', `**#${msg.channel.name}**`);
		return msg.channel.send(channelset);
	}
	tableload.application.notificationstatus = false;
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.applicationnotification_channeldeleted);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Settings',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'applicationnotification',
	description: 'Defines a channel in which application notifications will be sent',
	usage: 'applicationnotification',
	example: ['applicationnotification'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
