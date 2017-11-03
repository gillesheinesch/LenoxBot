exports.run = async(client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.skipvote) {
		tableload.skipvote = 'false';
		await client.guildconfs.set(msg.guild, tableload);
		await client.guildconfs.close();
	}

	if (tableload.skipvote === 'false') {
		tableload.skipvote = 'true';
		msg.channel.send(`The skipvote function was activated. You can recruit with the command \`${tableload.prefix}skipnumber\` how much votes are necessary, to skip the current music!`);
		client.guildconfs.set(msg.guild, tableload);
		return client.guildconfs.close();
	} else {
		tableload.skipvote = 'false';
		msg.channel.send('The skipvote function was disabled');
		client.guildconfs.set(msg.guild, tableload);
		return client.guildconfs.close();
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'skipvote',
	description: 'Toggles the skipvote function',
	usage: 'skipvote',
	example: 'skipvote ',
	category: 'administration'
};
