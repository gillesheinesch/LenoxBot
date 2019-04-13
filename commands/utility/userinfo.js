const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = class userinfoCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'userinfo',
			group: 'utility',
			memberName: 'userinfo',
			description: 'Gives you information about you or another user',
			format: 'userinfo [@User/UserID]',
			aliases: ['uinfo', 'ui'],
			examples: ['userinfo @Tester#0001', 'userinfo 327533963923161090'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Information',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		moment.locale(msg.client.provider.getGuild(msg.message.guild.id, 'momentLanguage'));

		let user = msg.mentions.users.first();

		if (!user && args.slice().length === 0) {
			user = msg.author;
		} else if (user) {
			user = msg.mentions.users.first();
			if (user.bot) return msg.reply(lang.userinfo_botinfo);
		} else {
			try {
				const fetchedMember = await msg.guild.fetchMember(args.slice().join(' '));
				if (!fetchedMember) new Error('User not found!');
				user = fetchedMember;
				user = user.user;

				if (user.bot) return msg.reply(lang.userinfo_botinfo);
			} catch (error) {
				return msg.reply(lang.userinfo_usernotfound);
			}
		}

		const member = msg.guild.member(user) || await msg.guild.fetchMember(user);
		const userondiscord = moment(user.createdTimestamp).format('MMMM Do YYYY, h:mm:ss a');
		const useronserver = moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a');

		const credits = msg.client.provider.getUser(user.id, 'credits');
		const lenoxbotcoin = msg.client.emojis.get('412952854354067456');

		let description = '';

		try {
			description = msg.client.provider.getUser(user.id, 'description').length === 0 ? lang.userinfo_descriptioninfo : msg.client.provider.getUser(user.id, 'description');
		} catch (error) {
			description = lang.userinfo_descriptioninfo;
		}

		let badges;

		if (msg.client.provider.getUser(user.id, 'badges').length === 0) {
			badges = [];
		} else {
			const userBadges = msg.client.provider.getUser(user.id, 'badges');
			badges = userBadges.sort((a, b) => {
				if (a.rarity < b.rarity) {
					return 1;
				}
				if (a.rarity > b.rarity) {
					return -1;
				}
				return 0;
			});
		}

		const topBadges = [];

		for (let i = 0; i < badges.length; i++) {
			topBadges.push(badges[i].emoji);
		}

		const embed = new Discord.RichEmbed()
			.setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail(user.displayAvatarURL)
			.setDescription(description)
			.addField(`${lenoxbotcoin} ${lang.credits_credits}`, `$${credits}`)
			.addField(`💗 ${lang.userinfo_badges}`, topBadges.length > 0 ? topBadges.slice(0, 5).join(' ') : lang.userinfo_nobadges)
			.addField(`📥 ${lang.userinfo_created}`, userondiscord)
			.addField(`📌 ${lang.userinfo_joined}`, useronserver)
			.addField(`🏷 ${lang.userinfo_roles}`, member.roles.filter(r => r.name !== '@everyone').map(role => role.name).join(', ') || lang.userinfo_noroles)
			.addField(`⌚ ${lang.userinfo_status}`, user.presence.status)
			.addField(`🎮 ${lang.userinfo_playing}`, user.presence.game ? user.presence.game.name : lang.userinfo_nothing);

		msg.channel.send({
			embed: embed
		});
	}
};
