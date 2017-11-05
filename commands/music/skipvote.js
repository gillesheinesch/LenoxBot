exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.skipvote) {
		tableload.skipvote = 'false';
		await client.guildconfs.set(msg.guild, tableload);
		
	}

	if (tableload.skipvote === 'false') {
		tableload.skipvote = 'true';
		msg.channel.send(`The skipvote function was activated. You can recruit with the command \`${tableload.prefix}skipnumber\` how much votes are necessary, to skip the current music!`);
		return client.guildconfs.set(msg.guild, tableload);
	} else {
		tableload.skipvote = 'false';
		msg.channel.send('The skipvote function was disabled');
		return client.guildconfs.set(msg.guild, tableload);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'skipvote',
	description: 'Toggles the skipvote function',
	usage: 'skipvote',
	example: 'skipvote ',
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
