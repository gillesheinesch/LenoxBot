const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class blacklistCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'blacklist',
			group: 'staff',
			memberName: 'blacklist',
			description: 'Shows you a list of all Discord users banned by the bot',
			format: 'blacklist',
			aliases: [],
			examples: ['blacklist'],
			clientermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Blacklist',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');

		const guild = msg.client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'administrator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const blacklist = [];

		if (msg.client.provider.getBotsettings('botconfs', 'blacklist').length === 0) return msg.reply(lang.blacklist_error);

		const embedfooter = lang.blacklist_embedfooter.replace('%prefix', prefix);
		const embed = new Discord.RichEmbed()
			.setTitle(lang.blacklist_embedtitle)
			.setFooter(embedfooter);

		if (msg.client.provider.getBotsettings('botconfs', 'blacklist').length < 1) return msg.channel.send('There are no banned Discord users!');
		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'blacklist').length; i++) {
			blacklist.push(msg.client.provider.getBotsettings('botconfs', 'blacklist')[i]);
		}
		blacklist.forEach(r => embed.addField(`${r.userID}`, lang.blacklist_embedfield.replace('%moderatortag', msg.client.users.get(r.moderator) ? msg.client.users.get(r.moderator).tag : r.moderator).replace('%reason', r.reason)));

		await msg.channel.send({
			embed
		});
	}
};
