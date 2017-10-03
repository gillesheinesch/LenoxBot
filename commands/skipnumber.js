exports.run = async(client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));

	const tableconfig = client.guildconfs.get(msg.guild.id);
	const number = args.slice();

	if (!tableconfig.skipnumber) {
		tableconfig.skipnumber = 1;
		await client.guildconfs.set(msg.guild.id, tableconfig);
	}

	if (number.length === 0) return msg.channel.send(`The current vote number to skip music is \`${tableconfig.skipnumber}\``);
	if (number.length > 1) return msg.channel.send('Your new number of votes to skip music cannot have spaces!').then(m => m.delete(10000));
	if (isNaN(number)) return msg.channel.send('You must enter a number').then(m => m.delete(10000));
	if (number < 1) return msg.channel.send('The number can not be 0').then(m => m.delete(10000));

	tableconfig.skipnumber = number;
	client.guildconfs.set(msg.guild.id, tableconfig);
	msg.channel.send(`The number of votes to skip music has been changed to \`${number}\``);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};

exports.help = {
	name: 'skipnumber',
	description: 'Changes the necessary votes to skip music for users',
	usage: 'skipnumber {number}',
	example: 'skipnumber 3',
	category: 'administration'
};
