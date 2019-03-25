const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class unbanuserCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'unbanuser',
			group: 'staff',
			memberName: 'unbanuser',
			description: 'Removes an user from the blacklist',
			format: 'unbanuser {userId} {reason}',
			aliases: [],
			examples: ['unbanuser 238590234135101440 Mistake'],
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

		if (!userId || isNaN(userId)) return msg.reply(lang.unbanuser_noguildid);
		if (args.slice(1).length === 0) return msg.reply(lang.unbanuser_noreason);

		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'blacklist').length; i++) {
			if (msg.client.provider.getBotsettings('botconfs', 'blacklist')[i].userID === userId) {
				const embedtitle = lang.unbanuser_embedtitle.replace('%userid', userId);
				const embeddescription = lang.unbanuser_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
				const embed = new Discord.RichEmbed()
					.setColor('GREEN')
					.setTimestamp()
					.setTitle(embedtitle)
					.setDescription(embeddescription);

				await msg.client.channels.get('497395598182318100').send({
					embed: embed
				});

				const currentBlacklist = msg.client.provider.getBotsettings('botconfs', 'blacklist');
				currentBlacklist.splice(i, 1);
				await msg.client.provider.setBotsettings('botconfs', 'blacklist', currentBlacklist);

				return msg.reply(lang.unbanuser_unbanned);
			}
		}
		return msg.reply(lang.unbanuser_notbanned);
	}
};
