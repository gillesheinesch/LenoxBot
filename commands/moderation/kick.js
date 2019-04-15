const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class kickCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'kick',
			group: 'moderation',
			memberName: 'kick',
			description: 'Kick a user from the discord server with a certain reason',
			format: 'kick {@User} {reason}',
			aliases: ['k'],
			examples: ['kick @Monkeyyy11#7584 Spam'],
			clientpermissions: ['SEND_MESSAGES', 'KICK_MEMBERS'],
			userpermissions: ['KICK_MEMBERS'],
			shortDescription: 'Kick',
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
				return msg.reply(lang.kick_idcheck);
			}
		}

		if (user === msg.author) return msg.channel.send(lang.kick_yourself);
		if (!reason) return msg.reply(lang.kick_noinput);

		if (!member.kickable) return msg.reply(lang.kick_nopermission);
		await member.kick();

		const kicked = lang.kick_kicked.replace('%usertag', user.tag);
		const kickembed = new Discord.RichEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${kicked}`);
		msg.channel.send({ embed: kickembed });

		const kickedby = lang.kick_kickedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
		const kickdescription = lang.kick_kickdescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason);
		const embed = new Discord.RichEmbed()
			.setAuthor(kickedby, msg.author.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor('#FF0000')
			.setTimestamp()
			.setDescription(kickdescription);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'true') {
			const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.message.guild.id, 'modlogchannel'));
			return modlogchannel.send({ embed: embed });
		}
	}
};
