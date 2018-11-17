exports.run = (client, msg, args, lang) => {
	const newprefix = args.slice();
	const tableload = client.guildconfs.get(msg.guild.id);

	const currentprefix = lang.prefix_currentprefix.replace('%prefix', tableload.prefix);

	if (newprefix.length === 0) return msg.channel.send(currentprefix);
	if (newprefix.length > 1) return msg.channel.send(lang.prefix_error);

	tableload.prefix = newprefix.join(' ');
	client.guildconfs.set(msg.guild.id, tableload);

	const newprefixset = lang.prefix_newprefixset.replace('%newprefix', newprefix);

	return msg.channel.send(newprefixset);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};

exports.help = {
	name: 'prefix',
	description: 'Changes the prefix of the server or shows you the current prefix if you just use ?prefix',
	usage: 'prefix {new prefix}',
	example: ['prefix !=!'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};

