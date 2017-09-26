exports.run = (client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));	
	const newprefix = args.slice();
	const tableconfig = client.guildconfs.get(msg.guild.id);

	if (!newprefix) return msg.channel.send(`The prefix of this server is \`${tableconfig.prefix}\``);
	if (newprefix.length > 1) return msg.channel.send('Your new prefix cannot have spaces! \nExample: `---`, `=-=` but **not** like `= = ! =`!').then(m => m.delete(10000));

	tableconfig.prefix = newprefix;
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
	description: 'Changes the prefixprefix of the server or shows you the current prefix if you just use ?prefix',
	usage: 'prefix {new prefix}',
	example: 'prefix !=!',
	category: 'administration'
};

