exports.run = (client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.modlog === 'false') {
		tableload.modlogchannel = `${msg.channel.id}`;
		tableload.modlog = 'true';
		client.guildconfs.set(msg.guild.id, tableload);
		return msg.channel.send(`All moderative actions are now logged in Channel #${msg.channel.name}`);
	} else {
		tableload.modlog = 'false';
		client.guildconfs.set(msg.guild.id, tableload);
		return msg.channel.send(`All moderate actions will no longer be logged!`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: ['ml']
};
exports.help = {
	name: 'modlog',
	description: 'Toggles the anouncements on the current channel when a user get banned, kicked, warned or unbaned',
    usage: 'modlog',
    example: 'modlog',
	category: 'administration'
};
