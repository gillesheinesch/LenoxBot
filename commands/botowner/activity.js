exports.run = (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	const tableload = client.botconfs.get('botconfs');
	const channelId = msg.channel.id;
	if (tableload.activity === false) {
		tableload.activity = true;
		tableload.activitychannel = channelId;
		msg.channel.send('Activity now activated in this channel!');
	} else {
		tableload.activity = false;
		msg.channel.send('Activity now deactivated!');
	}
	client.botconfs.set('botconfs', tableload);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
	userpermissions: []
=======
	userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'activity',
	description: 'Shows the current bot usage',
	usage: 'activity',
	example: ['activity'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
