exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.ara) {
		tableload.ara = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	let addedrole = args.slice().join(' ');

	if (addedrole.length < 1) return msg.reply(lang.removeautomaticrole_noinput).then(m => m.delete(10000));

	let roleinput = args.slice().join(" ");
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === roleinput.toLowerCase());
	if (!foundRole) return msg.reply(lang.removeautomaticrole_rolenotexist).then(m => m.delete(10000));

	for (var i = 0; i < tableload.ara.length; i += 2) {
		if (foundRole.id === tableload.ara[i]) {
			const roleId = foundRole.id;
				for (var i = 0; i < tableload.ara.length; i += 2) {
					if (roleId === tableload.ara[i]) {
						tableload.ara.splice(i, 2);
						await client.guildconfs.set(msg.guild.id, tableload);
					}
				}
				await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(lang.removeautomaticrole_roleremoved);
		}
	}
	return msg.channel.send(lang.removeautomaticrole_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: "Automaticroles",
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
