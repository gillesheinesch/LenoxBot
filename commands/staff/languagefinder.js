const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const content = args.slice().join(' ');
	if (!content || isNaN(content)) return msg.reply(lang.languagefinder_noguildid);

	const tableload = client.guildconfs.get(content);
	if (!tableload) return msg.channel.send(lang.languagefinder_nofetch);

	const guildload = client.guilds.get(content);
	const requestedby = lang.languagefinder_requestedby.replace('%authortag', msg.author.tag);
	const embed = new Discord.RichEmbed()
		.setColor('ORANGE')
		.setThumbnail(guildload.iconURL)
		.addField(lang.languagefinder_embedfield1, `${guildload.owner.user.tag} (${guildload.owner.id})`)
		.addField(lang.languagefinder_embedfield2, tableload.language.toUpperCase())
		.setFooter(requestedby)
		.setAuthor(`${guildload.name} (${guildload.id})`);

	return client.channels.get('497395598182318100').send({ embed: embed });
};


exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'languagefinder',
	description: 'Allows the staffs of the bot to find out the language of a Discord server',
	usage: 'languagefinder {guildid}',
	example: ['languagefinder 352896116812939264'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
