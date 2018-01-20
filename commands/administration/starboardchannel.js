exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.starboardchannel) {
		tableload.starboardchannel = '';
	}


	const channelid = msg.channel.id;
	const channelName = client.channels.get(channelid).name;

	tableload.starboardchannel = channelid;

	await client.guildconfs.set(msg.guild.id, tableload);

	var starmessagesactivated = lang.starboardchannel_starmessagesactivated.replace('%channelname', `#**${channelName}**`);
	return msg.channel.send(starmessagesactivated);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'starboardchannel',
	description: 'Sets a specific channel for the Starboard messages',
	usage: 'starboard',
	example: ['starboard'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
