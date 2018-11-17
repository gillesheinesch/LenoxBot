const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const userId = args.slice(0, 1).join(' ');

	if (!userId || isNaN(userId)) return msg.reply(lang.blacklistadd_noguildid);
	if (args.slice(1).length === 0) return msg.reply(lang.blacklistadd_noreason);

	for (let i = 0; i < botconfs.blacklist.length; i++) {
		if (botconfs.blacklist[i].userID === userId) return msg.reply(lang.blacklistadd_already);
	}

	const discordUserBanSettings = {
		userID: userId,
		moderator: msg.author.id,
		reason: args.slice(1).join(' '),
		createdAt: Date.now()
	};

	const discordUserName = client.users.get(userId) ? client.users.get(userId).tag : 'undefined';

	const embedtitle = lang.blacklistadd_embedtitle.replace('%userid', userId).replace('%username', discordUserName === 'undefined' ? lang.blacklistadd_usernamenotknown : discordUserName);
	const embeddescription = lang.blacklistadd_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
	const embed = new Discord.RichEmbed()
		.setColor('#ff0000')
		.setTimestamp()
		.setTitle(embedtitle)
		.setDescription(embeddescription);

	await client.channels.get('497395598182318100').send({
		embed: embed
	});

	botconfs.blacklist.push(discordUserBanSettings);
	client.botconfs.set('blackbanlist', botconfs);

	return msg.reply(lang.blacklistadd_banned);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Blacklist',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'blacklistadd',
	description: 'Adds an discord user to the blacklist',
	usage: 'blacklistadd {userId} {reason}',
	example: ['blacklistadd 238590234135101440 Bugusing'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
