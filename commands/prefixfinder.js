const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const content = args.slice().join(" ");
    const guild = client.guilds.get('352896116812939264').roles.find('name', 'Staff').id;
	if (!msg.member.roles.get(guild)) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));
	if (!content) return msg.reply('You have to enter a guildid!');
	const tableload = client.guildconfs.get(content);
	const embed = new Discord.RichEmbed()
	.setColor('#FF7F24')
	.addField('Serverowner:', `${msg.guild.owner.user.tag} (${msg.guild.owner.id})`)
	.addField('Prefix:', tableload.prefix)
	.setAuthor(`${msg.guild.name} (${msg.guild.id})`);
	msg.channel.send({ embed });
};


exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'prefixfinder',
	description: 'Command for the LenoxBot Staff to find out a prefix of a guild',
	usage: 'prefixfinder {guildid}',
	example: 'randomnumber 352896116812939264',
	category: 'botowner'
};
