const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const tableload = client.guildconfs.get(msg.guild.id);
	const botconfs = client.botconfs.get('blackbanlist');
	const banlist = [];

	if (botconfs.banlist.length === 0) return msg.reply(lang.banlist_error);

	const embedfooter = lang.banlist_embedfooter.replace('%prefix', tableload.prefix);
	const embed = new Discord.RichEmbed()
		.setTitle(lang.banlist_embedtitle)
		.setFooter(embedfooter);

	for (let i = 0; i < botconfs.banlist.length; i++) {
		banlist.push(botconfs.banlist[i]);
	}
	banlist.forEach(r => embed.addField(`${r.discordServerID}`, lang.banlist_embedfield.replace('%moderatortag', client.users.get(r.moderator) ? client.users.get(r.moderator).tag : r.moderator).replace('%reason', r.reason)));

	await msg.channel.send({
		embed
	});
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
	name: 'banlist',
	description: 'Shows you a list of all Discord servers banned by the bot',
	usage: 'banlist',
	example: ['banlist'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
