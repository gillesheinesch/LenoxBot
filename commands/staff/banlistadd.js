const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase(), 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const guildId = args.slice(0, 1).join(" ");

	if (!guildId || isNaN(guildId)) return msg.reply('You didn\'t enter a discord server ID!');
	if (args.slice(1).length === 0) return msg.reply('You have to enter a reason!');

	for (var i = 0; i < botconfs.banlist.length; i++) {
		if (botconfs.banlist[i].discordServerID === guildId) return msg.reply('This discord server has already been banned!');
	}

	const discordServerBanSettings = {
		discordServerID: guildId,
		moderator: msg.author.id,
		reason: args.slice(1).join(" "),
		createdAt: Date.now()
	};

	const embed = new Discord.RichEmbed()
		.setColor('#ff0000')
		.setTimestamp()
		.setTitle(`The following discord server has been banned: ${guildId}`)
		.setDescription(`Moderator: ${msg.author.tag} (ID: ${msg.author.id}) \nReason: ${args.slice(1).join(" ")}`);

	await client.channels.get('425752252180070401').send({
		embed: embed
	});

	botconfs.banlist.push(discordServerBanSettings);
	await client.botconfs.set('blackbanlist', botconfs);

	msg.reply('The Discord server has been successfully banned!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: "Ban",
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
