exports.run = (client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);
	const text = args.slice().join(' ');
	
	var announceactivated = lang.announce_announcedeactivated.replace('%prefix', tableload.prefix);
	if (tableload.announce === 'false') return msg.channel.send(announceactivated);

	if (!text) return msg.channel.send(lang.annnounce_noinput).then(m => m.delete(10000));

	const announcechannel = tableload.announcechannel;
	const announcement = lang.announce_announcement.replace('%authortag', msg.author.tag);
	client.channels.get(announcechannel).send(`${announcement} ${text}`);
	msg.channel.send(lang.announce_annoucementsent).then(m => m.delete(10000));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['a'],
<<<<<<< HEAD
	userpermissions: ['ADMINISTRATOR']
=======
	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'announce',
	description: 'Write a new server announcement',
	usage: 'announce {text}',
	example: ['announce Today we reached 5000 members. Thank you for that!'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
