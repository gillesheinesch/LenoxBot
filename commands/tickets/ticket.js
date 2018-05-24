const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	console.log("ticket");
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!args || args.length === 0) return msg.reply('No input!');

	const categorycheck = msg.guild.channels.find('name', 'Tickets');

	if (!categorycheck) {
		msg.guild.createChannel('Tickets', "category", [{
			deny: ['VIEW_CHANNEL']
		}])
	} else {
		if (!categorycheck.type === 'category') {
			msg.guild.createChannel('Tickets', "category", [{
				deny: ['VIEW_CHANNEL']
			}])
		}
	}

	console.log(1);
};


exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'ticket',
	description: '',
	usage: '',
	example: [],
	category: 'tickets',
	botpermissions: ['SEND_MESSAGES']
};
