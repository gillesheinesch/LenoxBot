const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_GIVEXP_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_GIVEXP_EXTENDEDHELP'),
			usage: '<GuildMember:member> <Amount:int>',
			usageDelim: ' ',
			requiredPermissions: ['SEND_MESSAGES'],
			permissionLevel: 10
		});
	}

	async run(message, [member, amount]) {
		const settings = member.settings;
		const guild_settings = message.guildSettings;
		const xpAmount = parseInt(amount, 10);

		if (!amount) return message.reply(message.language.get('COMMAND_GIVEXP_NOAMOUNT'));
		if (isNaN(xpAmount)) return message.reply(message.language.get('COMMAND_GIVEXP_AMOUNTNAN'));
		if (xpAmount <= 0) return message.reply(message.language.get('COMMAND_GIVEXP_ATLEAST1'));
		const xpmessages = guild_settings.get('xpmessages');
		const currentScores = {
			points: settings.get('points'),
			level: settings.get('level')
		}
		await settings.update('points', currentScores.points += xpAmount);

		const curLevel = Math.floor(0.3 * Math.sqrt(currentScores.points + 1));
		if (curLevel > currentScores.level) {
			currentScores.level = curLevel;

			if (xpmessages === 'true') {
				message.channel.sendLocale('COMMAND_GIVEXP_MESSAGEEVENT_LEVELUP', [message.author, currentScores.level]);
			}
		}
		if (curLevel < currentScores.level) {
			currentScores.level = curLevel;

			if (xpmessages === 'true') {
				message.channel.sendLocale('COMMAND_GIVEXP_MESSAGEEVENT_LEVELUP', [message.author, currentScores.level]);
			}
		}

		//await message.client.provider.setGuild(message.guild.id, 'scores', currentScores); remove this unless needed

		return message.reply(message.language.get('COMMAND_GIVEXP_DONE'));
	}
};