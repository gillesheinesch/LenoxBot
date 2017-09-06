exports.run = (client, msg, args) => {
	const newprefix = args.slice().join(' ');
	const tableconfig = client.guildconfs.get(msg.guild.id);

	if (!newprefix) return msg.channel.send(`The prefix of this server is \`${tableconfig.prefix}\``);
	if (newprefix.length > 1) return msg.channel.send('Your new prefix can not be longer than 1 character!').then(m => m.delete(10000));

	tableconfig.prefix = newprefix[0];
	client.guildconfs.set(msg.guild.id, tableconfig);
	msg.channel.send(`The prefix has been changed to **${newprefix}**`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'prefix',
	description: 'Changes the prefix of the server or shows you the current prefix if you just use ?prefix',
	usage: 'prefix {new prefix}',
	example: 'randomnumber !',
	category: 'administration'
};

