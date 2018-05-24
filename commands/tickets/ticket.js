const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	var botconfs = client.botconfs.get('botconfs');

	if (!args || args.length === 0) return msg.reply('no input!');

	const input = args.slice();

	const confs = {
		guildid: msg.guild.id,
		author: msg.author.id,
		users: [],
		status: "open",
		content: input.join(" "),
		answers: {}
	};

	botconfs.ticketid = botconfs.ticketid + 1;
	botconfs.tickets[botconfs.ticketid] = confs;

	await client.botconfs.set('botconfs', botconfs);

	return msg.reply(`New ticket created. You can manage it under https://lenoxbot.com/tickets/${botconfs.ticketid}`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'ticket',
	description: 'Creates a new ticket',
	usage: '',
	example: [],
	category: 'tickets',
	botpermissions: ['SEND_MESSAGES']
};
