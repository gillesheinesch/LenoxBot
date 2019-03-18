const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class banlistremoveCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'banlistremove',
			group: 'staff',
			memberName: 'banlistremove',
			description: 'Removes a Discord Server from the banlist',
			format: 'banlistremove {guildid} {reason}',
			aliases: [],
			examples: ['banlistremove 352896116812939264 Mistake'],
			clientermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Ban',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const guild = msg.client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'administrator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const guildId = args.slice(0, 1).join(' ');

		if (!guildId || isNaN(guildId)) return msg.reply(lang.banlistremove_noguildid);
		if (args.slice(1).length === 0) return msg.reply(lang.banlistremove_noreason);

		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'banlist').length; i++) {
			if (msg.client.provider.getBotsettings('botconfs', 'banlist')[i].discordServerID === guildId) {
				const embedtitle = lang.banlistremove_embedtitle.replace('%guildid', guildId);
				const embeddescription = lang.banlistremove_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
				const embed = new Discord.RichEmbed()
					.setColor('#66ff33')
					.setTimestamp()
					.setTitle(embedtitle)
					.setDescription(embeddescription);

				await msg.client.channels.get('497395598182318100').send({
					embed: embed
				});

				const currentBanlist = msg.client.provider.getBotsettings('botconfs', 'banlist');
				currentBanlist.splice(i, 1);
				await msg.client.provider.setBotsettings('botconfs', 'banlist', currentBanlist);

				return msg.reply(lang.banlistremove_unbanned);
			}
		}
		return msg.reply(lang.banlistremove_notbanned);
	}
};
