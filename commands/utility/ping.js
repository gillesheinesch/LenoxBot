exports.run = async(client, msg, args, lang) => {
		const message = await msg.channel.send('Hmm...Ping?');
		var newmsg = lang.ping_ping.replace('%timestamp', message.createdTimestamp - msg.createdTimestamp);
	message.edit(newmsg);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
<<<<<<< HEAD
    userpermissions: []
=======
    userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'ping',
	description: 'Shows you how long the bot needs to send a message',
	usage: 'ping',
	example: ['ping'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
