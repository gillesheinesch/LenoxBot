const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const guild = client.guilds.get('352896116812939264').roles.find('name', 'Moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));

	const content = args.slice().join(" ");
	if (!content) return msg.reply('You have to enter a guildid!');

	if (isNaN(content)) return msg.channel.send('It must be a GuildID');
	const tableload = client.guildconfs.get(content);

	if (!tableload) return msg.channel.send('Could not find this guild in the database!');

	const guildload = client.guilds.get(content);
	const embed = new Discord.RichEmbed()
	.setColor('#FF7F24')
	.setThumbnail(guildload.iconURL)
	.addField('Serverowner:', `${guildload.owner.user.tag} (${guildload.owner.id})`)
	.addField('Prefix:', tableload.prefix)
	.setFooter(`Requested by ${msg.author.tag}`)
	.setAuthor(`${guildload.name} (${guildload.id})`);
	client.channels.get('425752252180070401').send({ embed });
};


exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['pf'],
    userpermissions: []
};
exports.help = {
	name: 'prefixfinder',
	description: 'Command for the LenoxBot Staff to find out a prefix of a guild',
	usage: 'prefixfinder {guildid}',
	example: ['prefixfinder 352896116812939264'],
	category: 'staff',
    botpermissions: ['SEND_MESSAGES']
};
