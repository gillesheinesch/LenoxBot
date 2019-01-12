const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class banlistCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'banlist',
			group: 'staff',
			memberName: 'banlist',
			description: 'Shows you a list of all Discord servers banned by the bot',
			format: 'banlist',
			aliases: [],
			examples: ['banlist'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'Ban',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');
		const lang = require(`../../languages/${langSet}.json`);

		const guild = msg.client.guilds.get('332612123492483094').roles.find(r => r.name.toLowerCase() === 'moderator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const banlist = [];

		if (msg.client.provider.getBotsettings('botconfs', 'banlist').length === 0) return msg.reply(lang.banlist_error);

		const embedfooter = lang.banlist_embedfooter.replace('%prefix', prefix);
		const embed = new Discord.RichEmbed()
			.setTitle(lang.banlist_embedtitle)
			.setFooter(embedfooter);

		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'banlist').length; i++) {
			banlist.push(msg.client.provider.getBotsettings('botconfs', 'banlist')[i]);
		}
		banlist.forEach(r => embed.addField(`${r.discordServerID}`, lang.banlist_embedfield.replace('%moderatortag', msg.client.users.get(r.moderator) ? msg.client.users.get(r.moderator).tag : r.moderator).replace('%reason', r.reason)));

		await msg.channel.send({
			embed
		});
	}
};
