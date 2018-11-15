exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (args.length < 1) return msg.reply(lang.muterole_noinput);

	const role = msg.guild.roles.find(guildRole => guildRole.name.toLowerCase() === args.slice().join(' ').toLowerCase());
	if (!role) return msg.reply(lang.muterole_rolenotexist);

	if (!tableload.muterole) {
		tableload.muterole = '';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	tableload.muterole = role.id;
	client.guildconfs.set(msg.guild.id, tableload);
	msg.channel.send(lang.muterole_mutedroleset);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Mute',
	aliases: ['m'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};

exports.help = {
	name: 'muterole',
	description: 'Defines a muted role which muted users will get',
	usage: 'muterole {name of the role}',
	example: ['muterole muted'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
