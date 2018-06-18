exports.run = async(client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);    
	const tableload = client.botconfs.get('blackbanlist');
	const guildId = args.slice().join(" ");
		for (var i = 0; i < tableload.banlist.length; i++) {
			if (guildId === tableload.banlist[i]) {
			tableload.banlist.splice(i, 1);
			client.botconfs.set('blackbanlist', tableload);
			await msg.channel.send('Guild successfully removed from the banlist').then(m => m.delete(10000));
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: [], dashboardsettings: true
};
exports.help = {
	name: 'banlistremove',
	description: 'Remove a guild from the banlist',
	usage: 'banlistremove {guildid}',
	example: ['banlistremove 352896116812939264'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
