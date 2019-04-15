const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class clearCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'clear',
			group: 'moderation',
			memberName: 'clear',
			description: 'Deletes for you the last X messages that were sent in the current channel',
			format: 'clear {amount of messages between 2 and 100}',
			aliases: ['purge'],
			examples: ['clear 50'],
			clientpermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
			userpermissions: ['MANAGE_MESSAGES'],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		if (args.slice().length === 0) return msg.reply(lang.clear_error);
		if (isNaN(args.slice().join(' '))) return msg.reply(lang.clear_number);

		const messagecount = parseInt(args.join(' '), 10);

		if (messagecount > 100) return msg.reply(lang.clear_max100);
		if (messagecount < 2) return msg.reply(lang.clear_min2);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'commanddel') === 'false') {
			await msg.delete();
		}

		await msg.channel.fetchMessages({ limit: messagecount }).then(messages => msg.channel.bulkDelete(messages));

		const messagesdeleted = lang.clear_messagesdeleted.replace('%messagecount', messagecount);
		const messageclearembed = new Discord.RichEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${messagesdeleted}`);
		return msg.channel.send({ embed: messageclearembed });
	}
};
