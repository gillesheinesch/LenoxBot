exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.ara) {
		tableload.ara = [];
		client.guildconfs.set(msg.guild.id, tableload);
	}

	const addedrole = args.slice().join(' ');

	if (addedrole.length < 1) return msg.reply(lang.removeautomaticrole_noinput);

	const roleinput = args.slice().join(' ');
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === roleinput.toLowerCase());
	if (!foundRole) return msg.reply(lang.removeautomaticrole_rolenotexist);

	for (let i = 0; i < tableload.ara.length; i += 2) {
		if (foundRole.id === tableload.ara[i]) {
			const roleId = foundRole.id;
			for (let index = 0; index < tableload.ara.length; index += 2) {
				if (roleId === tableload.ara[index]) {
					tableload.ara.splice(index, 2);
					client.guildconfs.set(msg.guild.id, tableload);
				}
			}
			client.guildconfs.set(msg.guild.id, tableload);
			return msg.channel.send(lang.removeautomaticrole_roleremoved);
		}
	}
	return msg.channel.send(lang.removeautomaticrole_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Automaticroles',
	aliases: ['rar'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'removeautomaticrole',
	description: 'Removes an auto assignable role',
	usage: 'removeautomaticrole {name of the role}',
	example: ['removeautomaticrole TestRole'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
