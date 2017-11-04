exports.run = async(client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));	
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.starboardchannel) {
		tableload.starboardchannel = '';
	}

	if (tableload.starboard === 'false') return msg.channel.send('You must first activate the Starboard');

	const channelid = msg.channel.id;
	const channelName = client.channels.get(channelid).name;

	tableload.starboardchannel = channelid;
	msg.channel.send(`All StarMessages will be listed in the #**${channelName}** now!`);

	await client.guildconfs.set(msg.guild.id, tableload);
	await client.guildconfs.close();
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'starboardchannel',
	description: 'Sets a specific channel for the Starboard messages',
	usage: 'starboard',
	example: 'starboard',
	category: 'administration'
};
