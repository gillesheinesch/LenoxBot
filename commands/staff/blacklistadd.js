const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class blacklistaddCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'blacklistadd',
			group: 'staff',
			memberName: 'blacklistadd',
			description: 'Adds an discord user to the blacklist',
			format: 'blacklistadd {userId} {reason}',
			aliases: [],
			examples: ['blacklistadd 238590234135101440 Bugusing'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'Blacklist',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const guild = msg.client.guilds.get('332612123492483094').roles.find(r => r.name.toLowerCase() === 'administrator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const userId = args.slice(0, 1).join(' ');

		if (!userId || isNaN(userId)) return msg.reply(lang.blacklistadd_noguildid);
		if (args.slice(1).length === 0) return msg.reply(lang.blacklistadd_noreason);

		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'blacklist').length; i++) {
			if (msg.client.provider.getBotsettings('botconfs', 'blacklist')[i].userID === userId) return msg.reply(lang.blacklistadd_already);
		}

		const discordUserBanSettings = {
			userID: userId,
			moderator: msg.author.id,
			reason: args.slice(1).join(' '),
			createdAt: Date.now()
		};

		const discordUserName = msg.client.users.get(userId) ? msg.client.users.get(userId).tag : 'undefined';

		const embedtitle = lang.blacklistadd_embedtitle.replace('%userid', userId).replace('%username', discordUserName === 'undefined' ? lang.blacklistadd_usernamenotknown : discordUserName);
		const embeddescription = lang.blacklistadd_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
		const embed = new Discord.RichEmbed()
			.setColor('#ff0000')
			.setTimestamp()
			.setTitle(embedtitle)
			.setDescription(embeddescription);

		await msg.client.channels.get('530079522532622396').send({
			embed: embed
		});

		const currentBlacklist = msg.client.provider.getBotsettings('botconfs', 'blacklist');
		currentBlacklist.push(discordUserBanSettings);
		await msg.client.provider.setBotsettings('botconfs', 'blacklist', currentBlacklist);

		return msg.reply(lang.blacklistadd_banned);
	}
};
