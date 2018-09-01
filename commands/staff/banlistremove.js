const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase(), 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const guildId = args.slice(0, 1).join(" ");

	if (!guildId || isNaN(guildId)) return msg.reply('You didn\'t enter a discord server ID!');
	if (args.slice(1).length === 0) return msg.reply('You have to enter a reason!');

	for (var i = 0; i < botconfs.banlist.length; i++) {
		if (botconfs.banlist[i].discordServerID === guildId) {
			const embed = new Discord.RichEmbed()
				.setColor('#66ff33')
				.setTimestamp()
				.setTitle(`The following discord server has been unbanned: ${guildId}`)
				.setDescription(`Moderator: ${msg.author.tag} (ID: ${msg.author.id}) \n\nReason: ${args.slice(1).join(" ")}`);

			await client.channels.get('413750421341863936').send({
				embed: embed
			});

			botconfs.banlist.slice(i, 1);
			await client.botconfs.set('blackbanlist', botconfs);

			return msg.reply('The Discord server has been successfully unbanned!');
		}
	}
	return msg.reply('This Discord server isn\'t banned!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'banlistremove',
	description: 'Removes a Discord Server from the banlist',
	usage: 'banlistremove {guildid} {reason}',
	example: ['banlistremove 352896116812939264 Mistake'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
