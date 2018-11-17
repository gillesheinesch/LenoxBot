const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const guildId = args.slice(0, 1).join(' ');

	if (!guildId || isNaN(guildId)) return msg.reply(lang.banlistadd_noguildid);
	if (args.slice(1).length === 0) return msg.reply(lang.banlistadd_noreason);

	for (let i = 0; i < botconfs.banlist.length; i++) {
		if (botconfs.banlist[i].discordServerID === guildId) return msg.reply(lang.banlistadd_alreadybanned);
	}

	const discordServerBanSettings = {
		discordServerID: guildId,
		moderator: msg.author.id,
		reason: args.slice(1).join(' '),
		createdAt: Date.now()
	};

	const discordServerName = client.guilds.get(guildId) ? client.guilds.get(guildId).name : 'undefined';

	const embedtitle = lang.banlistadd_embedtitle.replace('%guildid', guildId).replace('%guildname', discordServerName === 'undefined' ? lang.banlistadd_guildnamenotknown : discordServerName);
	const embeddescription = lang.banlistadd_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
	const embed = new Discord.RichEmbed()
		.setColor('#ff0000')
		.setTimestamp()
		.setTitle(embedtitle)
		.setDescription(embeddescription);

	await client.channels.get('497395598182318100').send({
		embed: embed
	});

	botconfs.banlist.push(discordServerBanSettings);
	client.botconfs.set('blackbanlist', botconfs);

	return msg.reply(lang.banlistadd_banned);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Ban',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'banlistadd',
	description: 'Adds a discord server to the banlist',
	usage: 'banlistadd {guildId} {reason}',
	example: ['banlistadd 352896116812939264 Crashing the bot'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
