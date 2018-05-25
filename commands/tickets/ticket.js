const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	var botconfs = client.botconfs.get('botconfs');

	if (!args || args.length === 0) return msg.reply(lang.ticket_noinput);

	const input = args.slice();

	const confs = {
		guildid: msg.guild.id,
		authorid: msg.author.id,
		ticketid: botconfs.ticketid + 1,
		date: msg.createdTimestamp,
		users: [],
		status: "open",
		content: input.join(" "),
		answers: {}
	};

	botconfs.ticketid = botconfs.ticketid + 1;
	botconfs.tickets[botconfs.ticketid] = confs;

	await client.botconfs.set('botconfs', botconfs);

	const created = lang.ticket_created.replace('%link', `https://lenoxbot.com/tickets/${botconfs.ticketid}`);
	return msg.reply(created);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: [],
	cooldown: 300000
};
exports.help = {
	name: 'ticket',
	description: 'Creates a new ticket',
	usage: '',
	example: [],
	category: 'tickets',
	botpermissions: ['SEND_MESSAGES']
};
