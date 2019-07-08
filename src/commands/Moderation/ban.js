const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { ModLog } = require('../../');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_BAN_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_BAN_EXTENDEDHELP'),
			usage: '<User:user> <Reason:str> [...]',
			usageDelim: ' ',
			aliases: ['b', 'bean'],
			requiredPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
			permissionLevel: 4,
			enabled: true
		});
	}

	async run(message, [user, ...given_reason]) {
		const reason = given_reason.join(' ');

		if (user === message.author) return message.channel.sendLocale('COMMAND_BAN_YOURSELF');
		if (!reason) return message.reply(message.language.get('COMMAND_BAN_NOINPUT'));

		if (message.guild.members.has(user.id) && !message.guild.members.get(user.id).bannable) return message.reply(message.language.get('COMMAND_BAN_NOPERMISSION'));
		await message.guild.members.ban(user.id, { reason: reason }).then((usr) => {
			message.channel.send(new MessageEmbed()
				.setColor(10092390)
				.setDescription(`✅ ${message.language.get('COMMAND_BAN_BANNED', usr.tag)}`)
			);
			if (message.guildSettings.get('moderations.modlogs_enabled')) {
				new ModLog(message.guild)
					.setAction('ban')
					.setModerator(message.author)
					.setUser(user)
					.setReason(reason)
					.send()
			}
		}).catch((error) => {
			message.channel.send(new MessageEmbed()
				.setColor(16724253)
				.setDescription(`❌ ${message.language.get('COMMAND_BAN_BANNED_FAILED', user.tag, error)}`)
			);
		});

		/*const punishmentConfig = {
			id: guild_settings.get('moderations.punishments').length + 1,
			userId: user.id,
			reason: reason,
			date: Date.now(),
			moderatorId: message.author.id,
			type: 'ban'
		};
		await guild_settings.update('moderations.punishments', punishmentConfig, { arrayAction: 'add' });*/
	}
};