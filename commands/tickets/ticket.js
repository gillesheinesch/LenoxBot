const Discord = require('discord.js');
const keygenerator = require('../../utils/keygenerator.js');
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const botconfs = client.botconfs.get('botconfs');

	if (!args || args.length === 0) {
		const timestamps = client.cooldowns.get('ticket');
		delete timestamps[msg.author.id];
		client.cooldowns.set('ticket', timestamps);
		return msg.reply(lang.ticket_noinput);
	}

	const input = args.slice();

	let key = '';
	for (let i = 0; i < 1000; i++) {
		key = keygenerator.generateKey();

		if (!botconfs.ticketids.includes(key)) {
			break;
		}

		if (i === 999) {
			key = undefined;
		}
	}
	if (key !== undefined) {
		await botconfs.ticketids.push(key);
	}

	const confs = {
		guildid: msg.guild.id,
		authorid: msg.author.id,
		ticketid: key,
		date: msg.createdTimestamp,
		users: [],
		status: 'open',
		content: input.join(' '),
		answers: {}
	};

	botconfs.tickets[key] = confs;

	const ticket = botconfs.tickets[key];

	if (tableload.tickets.status === true) {
		const ticketembed = lang.mainfile_ticketembed.replace('%ticketid', ticket.ticketid);
		const embed = new Discord.RichEmbed()
			.setURL(`https://lenoxbot.com/dashboard/${ticket.guildid}/tickets/${key}/overview`)
			.setTimestamp()
			.setColor('#66ff33')
			.setTitle(lang.mainfile_ticketembedtitle)
			.setDescription(ticketembed);

		if (client.channels.get(tableload.tickets.notificationchannel)) {
			client.channels.get(tableload.tickets.notificationchannel).send({
				embed
			});
		}
	}

	client.botconfs.set('botconfs', botconfs);

	const created = lang.ticket_created.replace('%link', `https://lenoxbot.com/tickets/${key}/overview`);
	return msg.reply(created);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'ticket',
	description: 'Creates a new ticket',
	usage: 'ticket {text}',
	example: ['ticket Hello how can I open Discord?'],
	category: 'tickets',
	botpermissions: ['SEND_MESSAGES']
};
