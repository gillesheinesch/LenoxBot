const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

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
			enabled: false
		});
	}

	async run(message, [user, ...given_reason]) {
		const langSet = message.client.provider.getGuild(message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const reason = given_reason.join(' ');

		if (user === message.author) return message.channel.sendLocale('COMMAND_BAN_YOURSELF');
		if (!reason) return message.reply(message.language.get('COMMAND_BAN_NOINPUT'));

		if (message.guild.members.has(user.id) && !message.guild.members.get(user.id).bannable) return message.reply(message.language.get('COMMAND_BAN_NOPERMISSION'));
		message.guild.members.ban(user.id, { reason: reason });

		const banned = message.language.get('COMMAND_BAN_BANNED', user.tag);
		message.channel.send(new MessageEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${banned}`)
		);

		const bandescription = message.language.get('COMMAND_BAN_BANDESCRIPTION', user.tag, user.id, reason);
		const embed = new MessageEmbed()
			.setAuthor(`${message.language.get('COMMAND_BAN_BANNEDBY')} ${message.author.tag}`, message.author.displayAvatarURL())
			.setThumbnail(user.displayAvatarURL())
			.setColor('#FF0000')
			.setTimestamp()
			.setDescription(bandescription);

		const guild_settings = message.guildSettings;
		if (guild_settings.get('modlog') === 'true') {
			const modlogchannel = this.client.channels.get(guild_settings.get('modlogchannel'));
			modlogchannel.send({ embed: embed });
		}

		// will finish another day (I ended here)

		const currentPunishments = message.client.provider.getGuild(message.guild.id, 'punishments');
		const punishmentConfig = {
			id: currentPunishments.length + 1,
			userId: user.id,
			reason: reason,
			date: Date.now(),
			moderatorId: message.author.id,
			type: 'ban'
		};

		currentPunishments.push(punishmentConfig);
		await message.client.provider.setGuild(message.guild.id, 'punishments', currentPunishments);
	}
};