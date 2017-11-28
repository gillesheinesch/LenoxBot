exports.run = async(client, msg, args) => {
	if (isNaN(args.slice().join(" "))) return msg.reply('The number of messages, that must be deleted, must be a number!').then(m => m.delete(10000));

	let messagecount = parseInt(args.join(' '));

	if (messagecount > 100) return msg.reply('You can only delete 100 messages at once!').then(m => m.delete(10000));
	if (messagecount < 2) return msg.reply('You must delete at least 2 messages!').then(m => m.delete(10000));

	await msg.channel.fetchMessages({ limit: messagecount + 1 }).then(messages => msg.channel.bulkDelete(messages));
	msg.channel.send(`${messagecount} messages have been successfully deleted! ✅`).then(m => m.delete(5000));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['purge'],
    userpermissions: ['MANAGE_MESSAGES']
};
exports.help = {
	name: 'clear',
	description: 'Deletes for you the last X messages that were sent in the current channel',
	usage: 'clear {2-100}',
	example: 'clear 50',
	category: 'moderation',
    botpermissions: ['MANAGE_MESSAGES', 'SEND_MESSAGES']
};
