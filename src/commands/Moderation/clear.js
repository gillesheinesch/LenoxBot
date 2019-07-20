const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_CLEAR_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_CLEAR_EXTENDEDHELP'),
			usage: '<Amount:int>',
			usageDelim: ' ',
			aliases: ['purge'],
			requiredPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
			permissionLevel: 4,
			enabled: true
		});
	}

	async run(message, [amount]) {
		if (!amount) return message.channel.sendLocale('COMMAND_CLEAR_ERROR');
		if (isNaN(amount)) return message.channel.sendLocale('COMMAND_CLEAR_NUMBER');

		const messagecount = parseInt(amount, 10);

		if (messagecount > 100) return message.channel.sendLocale('COMMAND_CLEAR_MAXREACHED');
		if (messagecount < 2) return message.channel.sendLocale('COMMAND_CLEAR_MINREACHED');

		await message.channel.messages.fetch({ limit: messagecount }).then(messages => message.channel.bulkDelete(messages));

		return message.channel.send(new MessageEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${message.language.get('COMMAND_CLEAR_SUCCESS', amount)}`));
	}
};
