exports.run = (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);    
    const tableload = client.botconfs.get('blackbanlist');
    const userId = args.slice().join(" ");
    if (!userId) return msg.channel.send('You have to enter an userId!');
        tableload.blacklist.push(userId);
	client.botconfs.set('blackbanlist', tableload);
    msg.channel.send('User successfully set to the blacklist').then(m => m.delete(10000));
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
	name: 'blacklistadd',
	description: 'Add an user to the blacklist',
	usage: 'blacklistadd {userId}',
	example: ['blacklistadd 238590234135101440'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
