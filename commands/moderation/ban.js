const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class banCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'moderation',
			memberName: 'ban',
			description: 'Ban a user from the discord server with a certain reason',
			format: 'ban {@User/UserID} {reason}',
			aliases: ['b'],
			examples: ['ban @Monkeyyy11#7584 Toxic behavior', 'ban 406177968252256257 Spam'],
			clientpermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
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
		let user = msg.mentions.users.first();

		let member;
		if (user) {
			member = await msg.guild.fetchMember(user);
		}

		if (!user) {
			try {
				const fetchedMember = await msg.guild.fetchMember(args.slice(0, 1).join(' '));
				if (!fetchedMember) throw new Error('User not found!');
				user = fetchedMember;
				user = user.user;
			} catch (error) {
				return msg.reply(lang.ban_idcheck);
			}
		}

		if (user === msg.author) return msg.channel.send(lang.ban_yourself);
		if (!reason) return msg.reply(lang.ban_noinput);

		if (!member.bannable) return msg.reply(lang.ban_nopermission);
		msg.guild.ban(user);

		const banned = lang.ban_banned.replace('%usertag', user.tag);
		const banembed = new Discord.RichEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${banned}`);
		msg.channel.send({ embed: banembed });

		const bandescription = lang.ban_bandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason);
		const embed = new Discord.RichEmbed()
			.setAuthor(`${lang.ban_bannedby} ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor('#FF0000')
			.setTimestamp()
			.setDescription(bandescription);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'true') {
			const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.message.guild.id, 'modlogchannel'));
			return modlogchannel.send({ embed: embed });
		}
	}
};
