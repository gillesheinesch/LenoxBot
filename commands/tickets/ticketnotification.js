const LenoxCommand = require('../LenoxCommand.js');

module.exports = class ticketnotificationCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'ticketnotification',
			group: 'tickets',
			memberName: 'ticketnotification',
			description: 'Defines a channel in which ticket-notifications are sent',
			format: 'ticketnotification',
			aliases: [],
			examples: ['ticketnotification'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['ADMINISTRATOR'],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const channelid = msg.channel.id;
		if (msg.client.provider.getGuild(msg.message.guild.id, 'tickets').status === false) {
			const currentTickets = msg.client.provider.getGuild(msg.message.guild.id, 'tickets');
			currentTickets.status = true;
			currentTickets.notificationchannel = channelid;
			await msg.client.provider.setGuild(msg.message.guild.id, 'tickets', currentTickets);

			const channelset = lang.ticketnotification_channelset.replace('%channelname', `**#${msg.channel.name}**`);
			return msg.channel.send(channelset);
		}
		const currentTickets = msg.client.provider.getGuild(msg.message.guild.id, 'tickets');
		currentTickets.status = false;
		await msg.client.provider.setGuild(msg.message.guild.id, 'tickets', currentTickets);

		return msg.channel.send(lang.ticketnotification_channeldeleted);
	}
};
