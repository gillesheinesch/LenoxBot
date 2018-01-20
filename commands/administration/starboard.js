exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (tableload.starboardchannel === '') return msg.channel.send(lang.starboard_error);

	if (!tableload.starboard) {
		tableload.starboard = 'false';
	}

	if (tableload.starboard === 'false') {
		tableload.starboard = 'true';
		msg.channel.send(lang.starboard_enabled);
	} else {
		tableload.starboard = 'false';
		msg.channel.send(lang.starboard_disabled);
    }

	await client.guildconfs.set(msg.guild.id, tableload);
	
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'starboard',
	description: 'Enables/disables the starboard',
	usage: 'starboard',
	example: ['starboard'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
