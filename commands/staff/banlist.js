const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase(), 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const banlist = [];

	if (botconfs.banlist.length === 0) return msg.reply('No Discord servers have been added to the banlist!');

	const embed = new Discord.RichEmbed()
		.setTitle("Banned Discord servers:")
		.setFooter(`To add/remove a discord server, use ?banlistadd/?banlistremove`);

	if (botconfs.banlist.length < 1) return msg.channel.send('There is no banned Discord Server!');
	for (var i = 0; i < botconfs.banlist.length; i++) {
		banlist.push(botconfs.banlist[i]);
	}
	banlist.forEach(r => embed.addField(`${r.discordServerID} by ${client.users.get(r.moderator) ? client.users.get(r.moderator).tag : r.moderator}`, `Reason: ${r.reason}`));

	await msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'banlist',
	description: 'Shows you the banlist (banned guilds)',
	usage: 'banlist',
	example: ['banlist'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};