exports.run = (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	const input = args.slice().join(' ');
	if (!input) return msg.reply('You must specify a game state to run this command');
    client.user.setPresence({ game: { name: `${input}`, type: 0 } });
    msg.channel.send('Status set successfully.').then(m => m.delete(10000));
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'setgame',
	description: 'Sets a status of the Discord Bots',
	usage: 'setgame {text}',
    example: ['setgame LenoxBot'],
    category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
