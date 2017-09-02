exports.run = (client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.bye === 'false') {
        tableload.welcomebyechannel = `${msg.channel.id}`;
		tableload.bye = 'true';
		client.guildconfs.set(msg.guild.id, tableload);
		return msg.channel.send(`Every user who leaves the server will now be logged here in channel #${msg.channel.name}`);
	} else {
		tableload.bye = 'false';
		client.guildconfs.set(msg.guild.id, tableload);
		return msg.channel.send(`Every user who leaves the server will no longer be logged!`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'bye',
	description: 'Toggles the anouncements on the current channel when a user leaves the discord server',
    usage: 'bye',
    example: 'bye'
};
