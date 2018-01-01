exports.run = (client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);
	const text = args.slice().join(' ');
	
	var announceactivated = lang.annnounce_announcedeactivated.replace('%prefix', tableload.prefix);
	if (tableload.announce === 'false') return msg.channel.send(announceactivated);

	if (!text) return msg.channel.send(lang.annnounce_noinput).then(m => m.delete(10000));
	const announcechannel = tableload.announcechannel;
	client.channels.get(announcechannel).send(text);
	msg.channel.send(lang.annnounce_annoucementsent).then(m => m.delete(10000));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['a'],
	userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'announce',
	description: 'Write a new server announcement',
	usage: 'announce {text}',
	example: ['announce Today we reached 5000 members. Thank you for that!'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
