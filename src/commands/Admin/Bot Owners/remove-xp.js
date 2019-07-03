const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REMOVEXP_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_REMOVEXP_EXTENDEDHELP'),
			usage: '<GuildMember:member> <Amount:int>',
			usageDelim: ' ',
			requiredPermissions: ['SEND_MESSAGES'],
			permissionLevel: 10,
			guarded: true
		});
	}

	async run(message, [member, amount]) {
		const member_settings = member.settings;
		const guild_settings = message.guildSettings;
		const xpAmount = parseInt(amount, 10);

		if (!amount) return message.reply(message.language.get('COMMAND_REMOVEXP_NOAMOUNT'));
		if (isNaN(xpAmount)) return message.reply(message.language.get('COMMAND_REMOVEXP_AMOUNTNAN'));
		if (xpAmount <= 0) return message.reply(message.language.get('COMMAND_REMOVEXP_ATLEAST1'));
		const xpmessages = guild_settings.get('xp.xpmessages_enabled');
		const currentScores = {
			points: member_settings.get('scores.points') -= xpAmount,
			level: member_settings.get('scores.level')
		}

		const curLevel = Math.floor(0.3 * Math.sqrt(currentScores.points + 1));
		if (curLevel > currentScores.level) {
			currentScores.level = curLevel;

			if (xpmessages) {
				message.channel.sendLocale('MESSAGEEVENT_LEVELUP', [message.author, currentScores.level]);
			}
		}
		if (curLevel < currentScores.level) {
			currentScores.level = curLevel;

			if (xpmessages) {
				message.channel.sendLocale('MESSAGEEVENT_LEVELUP', [message.author, currentScores.level]);
			}
		}

		await member_settings.update({ scores: { points: currentScores.points, level: currentScores.level } });

		return message.reply(message.language.get('COMMAND_REMOVEXP_DONE'));
	}
};