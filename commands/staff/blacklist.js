const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const tableload = client.guildconfs.get(msg.guild.id);
	const botconfs = client.botconfs.get('blackbanlist');
	const blacklist = [];

	if (botconfs.blacklist.length === 0) return msg.reply(lang.blacklist_error);

	const embedfooter = lang.blacklist_embedfooter.replace('%prefix', tableload.prefix);
	const embed = new Discord.RichEmbed()
		.setTitle(lang.blacklist_embedtitle)
		.setFooter(embedfooter);

	if (botconfs.blacklist.length < 1) return msg.channel.send('There are no banned Discord users!');
	for (let i = 0; i < botconfs.blacklist.length; i++) {
		blacklist.push(botconfs.blacklist[i]);
	}
	blacklist.forEach(r => embed.addField(`${r.userID}`, lang.blacklist_embedfield.replace('%moderatortag', client.users.get(r.moderator) ? client.users.get(r.moderator).tag : r.moderator).replace('%reason', r.reason)));

	await msg.channel.send({
		embed
	});
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
	name: 'blacklist',
	description: 'Shows you a list of all Discord users banned by the bot',
	usage: 'blacklist',
	example: ['blacklist'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
