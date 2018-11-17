const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const userId = args.slice(0, 1).join(' ');

	if (!userId || isNaN(userId)) return msg.reply(lang.blacklistremove_noguildid);
	if (args.slice(1).length === 0) return msg.reply(lang.blacklistremove_noreason);

	for (let i = 0; i < botconfs.blacklist.length; i++) {
		if (botconfs.blacklist[i].userID === userId) {
			const embedtitle = lang.blacklistremove_embedtitle.replace('%userid', userId);
			const embeddescription = lang.blacklistremove_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
			const embed = new Discord.RichEmbed()
				.setColor('#66ff33')
				.setTimestamp()
				.setTitle(embedtitle)
				.setDescription(embeddescription);

			await client.channels.get('497395598182318100').send({
				embed: embed
			});

			botconfs.blacklist.splice(i, 1);
			client.botconfs.set('blackbanlist', botconfs);

			return msg.reply(lang.blacklistremove_unbanned);
		}
	}
	return msg.reply(lang.blacklistremove_notbanned);
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
	name: 'blacklistremove',
	description: 'Removes an user from the blacklist',
	usage: 'blacklistremove {userId} {reason}',
	example: ['blacklistremove 238590234135101440 Mistake'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
