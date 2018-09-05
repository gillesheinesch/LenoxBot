const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const userId = args.slice(0, 1).join(" ");

	if (!userId || isNaN(userId)) return msg.reply('You didn\'t enter a discord userID!');
	if (args.slice(1).length === 0) return msg.reply('You have to enter a reason!');

	for (var i = 0; i < botconfs.blacklist.length; i++) {
		if (botconfs.blacklist[i].userID === userId) return msg.reply('This discord user has already been banned!');
	}

	const discordUserBanSettings = {
		userID: userId,
		moderator: msg.author.id,
		reason: args.slice(1).join(" "),
		createdAt: Date.now()
	};

	const embed = new Discord.RichEmbed()
		.setColor('#ff0000')
		.setTimestamp()
		.setTitle(`The following discord user has been banned: ${userId}`)
		.setDescription(`Moderator: ${msg.author.tag} (ID: ${msg.author.id}) \nReason: ${args.slice(1).join(" ")}`);

	await client.channels.get('425752252180070401').send({
		embed: embed
	});

	botconfs.blacklist.push(discordUserBanSettings);
	await client.botconfs.set('blackbanlist', botconfs);

	msg.reply('The Discord user has been successfully banned!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: "Blacklist",
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