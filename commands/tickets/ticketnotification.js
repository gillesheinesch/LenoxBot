exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const channelid = msg.channel.id;
	if (tableload.tickets.status === false) {
		tableload.tickets.status = true;
		tableload.tickets.notificationchannel = channelid;
		await client.guildconfs.set(msg.guild.id, tableload);

		var channelset = lang.ticketnotification_channelset.replace('%channelname', `**#${msg.channel.name}**`);
		return msg.channel.send(channelset);
	} else {
		tableload.tickets.status = false;
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.ticketnotification_channeldeleted);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
};
exports.help = {
	name: 'ticketnotification',
	description: 'Defines a channel in which ticket-notifications are sent',
	usage: 'ticketnotification',
	example: ['ticketnotification'],
	category: 'tickets',
	botpermissions: ['SEND_MESSAGES']
};
