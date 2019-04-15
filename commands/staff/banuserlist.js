const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class banuserlistCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'banuserlist',
			group: 'staff',
			memberName: 'banuserlist',
			description: 'Shows you a list of all Discord users banned by the bot',
			format: 'banuserlist',
			aliases: [],
			examples: ['banuserlist'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Banuser',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');

		const guild = msg.client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const blacklist = [];

		if (msg.client.provider.getBotsettings('botconfs', 'blacklist').length === 0) return msg.reply(lang.banuserlist_error);

		const embedfooter = lang.banuserlist_embedfooter.replace('%prefix', prefix).replace('%prefix', prefix);
		const embed = new Discord.RichEmbed()
			.setColor('RED')
			.setTitle(lang.banuserlist_embedtitle)
			.setFooter(embedfooter);

		if (msg.client.provider.getBotsettings('botconfs', 'blacklist').length < 1) return msg.channel.send('There are no banned Discord users!');
		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'blacklist').length; i++) {
			blacklist.push(msg.client.provider.getBotsettings('botconfs', 'blacklist')[i]);
		}
		blacklist.forEach(r => embed.addField(`${r.userID}`, lang.banuserlist_embedfield.replace('%moderatortag', msg.client.users.get(r.moderator) ? msg.client.users.get(r.moderator).tag : r.moderator).replace('%reason', r.reason)));

		await msg.channel.send({
			embed
		});
	}
};
