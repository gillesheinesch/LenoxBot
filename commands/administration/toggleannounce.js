exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const channelid = msg.channel.id;
	if (tableload.announce === 'false') {
		tableload.announce = 'true';
		tableload.announcechannel = channelid;
		await client.guildconfs.set(msg.guild.id, tableload);

		var channelset = lang.toggleannounce_channelset.replace('%channelname', `**#${msg.channel.name}**`);
		return msg.channel.send(channelset);
	} else {
		tableload.announce = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.toggleannounce_channeldeleted);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['ta'],
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'toggleannounce',
	description: 'Sets a channel for announcements, where you can use the announce-command',
	usage: 'toggleannounce',
	example: ['toggleannounce'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
