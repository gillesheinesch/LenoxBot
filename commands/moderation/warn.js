const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class warnCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'warn',
			group: 'moderation',
			memberName: 'warn',
			description: 'Warn a user on the discord server with a certain reason',
			format: 'warn {@User/UserID} {reason}',
			aliases: ['w'],
			examples: ['warn @Monkeyyy11#7584 Spam'],
			clientpermissions: ['SEND_MESSAGES', 'KICK_MEMBERS'],
			userpermissions: ['KICK_MEMBERS'],
			shortDescription: 'Warn',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const reason = args.slice(1).join(' ');
		let user = msg.mentions.users.first();

		if (!user) {
			try {
				const fetchedMember = await msg.guild.fetchMember(args.slice(0, 1).join(' '));
				if (!fetchedMember) throw new Error('User not found!');
				user = fetchedMember;
				user = user.user;
			} catch (error) {
				return msg.reply(lang.warn_idcheck);
			}
		}

		if (user === msg.author) return msg.channel.send(lang.warn_yourself);
		if (!reason) return msg.reply(lang.warn_noinput);

		const warned = lang.warn_warned.replace('%usertag', user.tag);
		const warnembed = new Discord.RichEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${warned}`);
		msg.channel.send({ embed: warnembed });

		const warnedby = lang.warn_warnedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
		const warndescription = lang.warn_warndescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason);
		const embed = new Discord.RichEmbed()
			.setAuthor(warnedby, msg.author.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor('#fff024')
			.setTimestamp()
			.setDescription(warndescription);

		user.send({ embed: embed });

		if (!msg.client.provider.getGuild(msg.message.guild.id, 'warnlog')) {
			await msg.client.provider.setGuild(msg.message.guild.id, 'warnlog', []);
		}

		const currentWarnlog = msg.client.provider.getGuild(msg.message.guild.id, 'warnlog');
		await currentWarnlog.push(user.id);
		await currentWarnlog.push(new Date().getTime());
		await currentWarnlog.push(reason);
		await currentWarnlog.push(msg.author.id);
		await msg.client.provider.setGuild(msg.message.guild.id, 'warnlog', currentWarnlog);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'true') {
			const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.message.guild.id, 'modlogchannel'));
			return modlogchannel.send({ embed: embed });
		}
	}
};
