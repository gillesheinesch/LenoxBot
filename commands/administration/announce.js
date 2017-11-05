exports.run = (client, msg, args) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    const text = args.slice().join(' ');
    if (tableload.announce === 'false') return msg.channel.send(`You must first define where announcements should be posted. \nUse the following command \`${tableload.prefix}toggleannounce\` to activate announcements in your current channel!`);
	if (!text) return msg.channel.send('You forgot to enter a text!').then(m => m.delete(10000));
	const announcechannel = tableload.announcechannel;
	client.channels.get(announcechannel).send(text);
	msg.channel.send('Announcement successfully sent!').then(m => m.delete(10000));
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
	example: 'announce Today we reached 5000 members. Thank you for that!',
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
