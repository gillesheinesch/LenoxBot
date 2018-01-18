exports.run = async(client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	const tableload = client.botconfs.get('blackbanlist');
	const userId = args.slice().join(" ");
		for (var i = 0; i < tableload.blacklist.length; i++) {
			if (userId === tableload.blacklist[i]) {
			tableload.blacklist.splice(i, 1);
			client.botconfs.set('blackbanlist', tableload);
			await msg.channel.send('User successfully removed from the blacklist!').then(m => m.delete(10000));
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'blacklistremove',
	description: 'Remove an user from the blacklist',
	usage: 'blacklistremove {userId}',
	example: ['blacklistremove 238590234135101440'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
