const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const guildId = args.slice(0, 1).join(' ');

	if (!guildId || isNaN(guildId)) return msg.reply(lang.banlistremove_noguildid);
	if (args.slice(1).length === 0) return msg.reply(lang.banlistremove_noreason);

	for (let i = 0; i < botconfs.banlist.length; i++) {
		if (botconfs.banlist[i].discordServerID === guildId) {
			const embedtitle = lang.banlistremove_embedtitle.replace('%guildid', guildId);
			const embeddescription = lang.banlistremove_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
			const embed = new Discord.RichEmbed()
				.setColor('#66ff33')
				.setTimestamp()
				.setTitle(embedtitle)
				.setDescription(embeddescription);

			await client.channels.get('497395598182318100').send({
				embed: embed
			});

			botconfs.banlist.splice(i, 1);
			client.botconfs.set('blackbanlist', botconfs);

			return msg.reply(lang.banlistremove_unbanned);
		}
	}
	return msg.reply(lang.banlistremove_notbanned);
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
	name: 'banlistremove',
	description: 'Removes a Discord Server from the banlist',
	usage: 'banlistremove {guildid} {reason}',
	example: ['banlistremove 352896116812939264 Mistake'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
