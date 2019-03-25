const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class banserverCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'banserver',
			group: 'staff',
			memberName: 'banserver',
			description: 'Adds a discord server to the banlist',
			format: 'banserver {guildId} {reason}',
			aliases: [],
			examples: ['banserver 352896116812939264 Crashing the bot'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Banserver',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const guild = msg.client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const guildId = args.slice(0, 1).join(' ');

		if (!guildId || isNaN(guildId)) return msg.reply(lang.banserver_noguildid);
		if (args.slice(1).length === 0) return msg.reply(lang.banserver_noreason);

		for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'banlist').length; i++) {
			if (msg.client.provider.getBotsettings('botconfs', 'banlist')[i].discordServerID === guildId) return msg.reply(lang.banserver_alreadybanned);
		}

		const discordServerBanSettings = {
			discordServerID: guildId,
			moderator: msg.author.id,
			reason: args.slice(1).join(' '),
			createdAt: Date.now()
		};

		const discordServerName = msg.client.guilds.get(guildId) ? msg.client.guilds.get(guildId).name : 'undefined';

		const embedtitle = lang.banserver_embedtitle.replace('%guildid', guildId).replace('%guildname', discordServerName === 'undefined' ? lang.banserver_guildnamenotknown : discordServerName);
		const embeddescription = lang.banserver_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
		const embed = new Discord.RichEmbed()
			.setColor('RED')
			.setTimestamp()
			.setTitle(embedtitle)
			.setDescription(embeddescription);

		await msg.client.channels.get('497395598182318100').send({
			embed: embed
		});

		const currentBanlist = msg.client.provider.getBotsettings('botconfs', 'banlist');
		currentBanlist.push(discordServerBanSettings);
		await msg.client.provider.setBotsettings('botconfs', 'banlist', currentBanlist);

		return msg.reply(lang.banserver_banned);
	}
};
