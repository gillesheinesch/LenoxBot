exports.run = (client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.welcome === 'false') {
        tableload.welcomebyechannel = `${msg.channel.id}`;
		tableload.welcome = 'true';
		client.guildconfs.set(msg.guild.id, tableload);
		return msg.channel.send(`Every user who joins the server will now be logged in channel #${msg.channel.name}`);
	} else {
		tableload.welcome = 'false';
		client.guildconfs.set(msg.guild.id, tableload);
		return msg.channel.send(`Every user who joins the server will no longer be logged!`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: []
};
exports.help = {
	name: 'welcome',
	description: 'Toggles the announcements on the current channel when a user joins the discord server',
    usage: 'welcome',
    example: 'welcome',
	category: 'administration'
};
