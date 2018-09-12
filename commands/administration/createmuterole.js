exports.run = async (client, msg, args, lang) => {
	const newMuteRole = await msg.guild.createRole({
		name: 'muted',
		position: 1
	}, 'Lenoxbot muted role');

	const message = await msg.channel.send(lang.createmuterole_waitmessage);
	await message.channel.startTyping();

	for (let i = 0; i < msg.guild.channels.array().length; i++) {
		await msg.guild.channels.array()[i].overwritePermissions(newMuteRole, {
			SEND_MESSAGES: false,
			SPEAK: false,
			ADD_REACTIONS: false
		});
	}

	await message.channel.stopTyping();
	return message.edit(lang.createmuterole_done);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Roles',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'createmuterole',
	description: 'Creates the muted role and forbids all writing and speaking permissions',
	usage: 'createmuterole',
	example: ['createmuterole'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES', 'MANAGE_CHANNELS']
};
