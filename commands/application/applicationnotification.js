exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const channelid = msg.channel.id;
	if (tableload.application.notificationstatus === false) {
		tableload.application.notificationstatus = true;
		tableload.application.notificationchannel = channelid;
		await client.guildconfs.set(msg.guild.id, tableload);

		var channelset = lang.applicationnotification_channelset.replace('%channelname', `**#${msg.channel.name}**`);
		return msg.channel.send(channelset);
	} else {
		tableload.application.notificationstatus = false;
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.applicationnotification_channeldeleted);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
	userpermissions: ['ADMINISTRATOR']
=======
	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'applicationnotification',
	description: 'Defines a channel in which application notifications will be sent',
	usage: 'applicationnotification',
	example: ['applicationnotification'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
