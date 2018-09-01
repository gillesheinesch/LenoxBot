const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase(), 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const userId = args.slice(0, 1).join(" ");

	if (!userId || isNaN(userId)) return msg.reply('You didn\'t enter a discord userID!');
	if (args.slice(1).length === 0) return msg.reply('You have to enter a reason!');

	for (var i = 0; i < botconfs.blacklist.length; i++) {
		if (botconfs.blacklist[i].userID === userId) {
			const embed = new Discord.RichEmbed()
				.setColor('#66ff33')
				.setTimestamp()
				.setTitle(`The following Discord user has been unbanned: ${userId}`)
				.setDescription(`Moderator: ${msg.author.tag} (ID: ${msg.author.id}) \nReason: ${args.slice(1).join(" ")}`);

			await client.channels.get('425752252180070401').send({
				embed: embed
			});

			botconfs.blacklist.splice(i, 1);
			await client.botconfs.set('blackbanlist', botconfs);

			return msg.reply('The Discord user has been successfully unbanned!');
		}
	}
	return msg.reply('This Discord user isn\'t banned!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
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
