const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class blacklistremoveCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'blacklistremove',
			group: 'staff',
			memberName: 'blacklistremove',
			description: 'Removes an user from the blacklist',
			format: 'blacklistremove {userId} {reason}',
			aliases: [],
			examples: ['blacklistremove 238590234135101440 Mistake'],
			clientermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Blacklist',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const guild = msg.client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'administrator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const userId = args.slice(0, 1).join(' ');

		if (!userId || isNaN(userId)) return msg.reply(lang.blacklistremove_noguildid);
		if (args.slice(1).length === 0) return msg.reply(lang.blacklistremove_noreason);

		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'blacklist').length; i++) {
			if (msg.client.provider.getBotsettings('botconfs', 'blacklist')[i].userID === userId) {
				const embedtitle = lang.blacklistremove_embedtitle.replace('%userid', userId);
				const embeddescription = lang.blacklistremove_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
				const embed = new Discord.RichEmbed()
					.setColor('#66ff33')
					.setTimestamp()
					.setTitle(embedtitle)
					.setDescription(embeddescription);

				await msg.client.channels.get('497395598182318100').send({
					embed: embed
				});

				const currentBlacklist = msg.client.provider.getBotsettings('botconfs', 'blacklist');
				currentBlacklist.splice(i, 1);
				await msg.client.provider.setBotsettings('botconfs', 'blacklist', currentBlacklist);

				return msg.reply(lang.blacklistremove_unbanned);
			}
		}
		return msg.reply(lang.blacklistremove_notbanned);
	}
};
