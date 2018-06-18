exports.run = (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);    
    const tableload = client.botconfs.get('blackbanlist');
    const guildId = args.slice().join(" ");
    if (!guildId) return msg.channel.send('You have to enter an guildId!');
        tableload.banlist.push(guildId);
	client.botconfs.set('blackbanlist', tableload);
    msg.channel.send('Guild successfully set to the blacklist').then(m => m.delete(10000));
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
	name: 'banlistadd',
	description: 'Add a guild to the banlist',
	usage: 'banlistadd {guildId}',
	example: ['banlistadd 352896116812939264'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
