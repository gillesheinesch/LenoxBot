exports.run = (client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.starboard) {
		tableload.starboard = 'false';
	}

	if (tableload.starboard === 'false') {
		tableload.starboard = 'true';
		msg.channel.send('The starboard has been enabled successfully!');
	} else {
		tableload.starboard = 'false';
		msg.channel.send('The starboard has been disabled successfully!');
    }

    client.guildconfs.set(msg.guild.id, tableload);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'starboard',
	description: 'Enables/disables the starboard',
	usage: 'starboard',
	example: 'starboard',
	category: 'administration'
};
