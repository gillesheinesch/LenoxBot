const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class banuserCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'banuser',
			group: 'staff',
			memberName: 'banuser',
			description: 'Adds an discord user to the blacklist',
			format: 'banuser {userId} {reason}',
			aliases: [],
			examples: ['banuser 238590234135101440 Bugusing'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Banuser',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const guild = msg.client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const userId = args.slice(0, 1).join(' ');

		if (!userId || isNaN(userId)) return msg.reply(lang.banuser_noguildid);
		if (args.slice(1).length === 0) return msg.reply(lang.banuser_noreason);

		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'blacklist').length; i++) {
			if (msg.client.provider.getBotsettings('botconfs', 'blacklist')[i].userID === userId) return msg.reply(lang.banuser_already);
		}

		const discordUserBanSettings = {
			userID: userId,
			moderator: msg.author.id,
			reason: args.slice(1).join(' '),
			createdAt: Date.now()
		};

		const discordUserName = msg.client.users.get(userId) ? msg.client.users.get(userId).tag : 'undefined';

		const embedtitle = lang.banuser_embedtitle.replace('%userid', userId).replace('%username', discordUserName === 'undefined' ? lang.banuser_usernamenotknown : discordUserName);
		const embeddescription = lang.banuser_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
		const embed = new Discord.RichEmbed()
			.setColor('RED')
			.setTimestamp()
			.setTitle(embedtitle)
			.setDescription(embeddescription);

		await msg.client.channels.get('497395598182318100').send({
			embed: embed
		});

		const currentBlacklist = msg.client.provider.getBotsettings('botconfs', 'blacklist');
		currentBlacklist.push(discordUserBanSettings);
		await msg.client.provider.setBotsettings('botconfs', 'blacklist', currentBlacklist);

		return msg.reply(lang.banuser_banned);
	}
};
