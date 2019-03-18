const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class unbanCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'unban',
			group: 'moderation',
			memberName: 'unban',
			description: 'Unban a user from the discord server with a certain reason',
			format: 'unban {userID} {reason}',
			aliases: ['ub'],
			examples: ['unban 238590234135101440 Mistake'],
			clientpermissions: ['BAN_MEMBERS', 'MANAGE_GUILD', 'SEND_MESSAGES'],
			userpermissions: ['BAN_MEMBERS'],
			shortDescription: 'Ban',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const reason = args.slice(1).join(' ');
		msg.client.unbanReason = reason;
		msg.client.unbanAuth = msg.author;
		const user = args[0];

		if (!user) return msg.reply(lang.unban_nouserid);
		if (!reason) return msg.reply(lang.unban_noinput);

		const bans = await msg.guild.fetchBans();
		if (!bans.get(user)) return msg.reply(lang.unban_notbanned);

		await msg.guild.unban(user);

		const unbanned = lang.unban_unbanned.replace('%userid', user);
		const unbanembed = new Discord.RichEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${unbanned}`);
		msg.channel.send({
			embed: unbanembed
		});

		const unbannedby = lang.unban_unbannedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
		const unbandescription = lang.unban_unbandescription.replace('%userid', user).replace('%reason', reason);
		const embed = new Discord.RichEmbed()
			.setAuthor(unbannedby, msg.author.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor(0x00AE86)
			.setTimestamp()
			.setDescription(unbandescription);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'true') {
			const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.message.guild.id, 'modlogchannel'));
			modlogchannel.send({ embed: embed });
		}

		let banOfThisUser;
		for (const i in msg.client.provider.getBotsettings('botconfs', 'bans')) {
			if (msg.client.provider.getBotsettings('botconfs', 'bans')[i].discordserverid === msg.guild.id && msg.client.provider.getBotsettings('botconfs', 'bans')[i].memberid === user) {
				banOfThisUser = msg.client.provider.getBotsettings('botconfs', 'bans')[i];
			}
		}
		if (banOfThisUser) {
			const currentBans = msg.client.provider.getBotsettings('botconfs', 'bans');
			delete currentBans[banOfThisUser.banscount];
			await msg.client.provider.setBotsettings('botconfs', 'bans', currentBans);
		}
	}
};
