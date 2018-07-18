const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	var botconfs = client.botconfs.get('botconfs');

	if (!args || args.length === 0) {
		const timestamps = client.cooldowns.get('ticket');
		timestamps.delete(msg.author.id);
		return msg.reply(lang.ticket_noinput);
	}

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

	var ticket = botconfs.tickets[botconfs.ticketid];

	if (tableload.tickets.status === true) {
		const ticketembed = lang.mainfile_ticketembed.replace('%ticketid', ticket.ticketid);
		const embed = new Discord.RichEmbed()
		.setURL(`https://lenoxbot.com/dashboard/${ticket.guildid}/tickets/${ticket.ticketid}/overview`)
		.setTimestamp()
		.setColor('#66ff33')
		.setTitle(lang.mainfile_ticketembedtitle)
		.setDescription(ticketembed);
		
		try {
			client.channels.get(tableload.tickets.notificationchannel).send({ embed });
		} catch (error) {
			undefined;
		}
	}

	const created = lang.ticket_created.replace('%link', `https://lenoxbot.com/tickets/${botconfs.ticketid}/overview`);
	return msg.reply(created);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: [],
	dashboardsettings: true,
	cooldown: 300000
};
exports.help = {
	name: 'ticket',
	description: 'Creates a new ticket',
	usage: 'ticket {text}',
	example: ['ticket Hello how can I open Discord?'],
	category: 'tickets',
	botpermissions: ['SEND_MESSAGES']
};
