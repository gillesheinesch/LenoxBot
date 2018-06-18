exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	let addedrole = args.slice().join(' ');
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());

	if (addedrole.length < 1) return msg.reply(lang.removeselfassignablerole_noinput).then(m => m.delete(10000));
	if (!foundRole) return msg.reply(lang.removeselfassignablerole_rolenotexist).then(m => m.delete(10000));

	for (var i = 0; i < tableload.selfassignableroles.length; i++) {
		if (foundRole.id === tableload.selfassignableroles[i]) {
			const roleId = foundRole.id;
				for (var i = 0; i < tableload.selfassignableroles.length; i++) {
					if (roleId === tableload.selfassignableroles[i]) {
						tableload.selfassignableroles.splice(i, 1);
						await client.guildconfs.set(msg.guild.id, tableload);
					}
				}
				await client.guildconfs.set(msg.guild.id, tableload);
		
				return msg.channel.send(lang.removeselfassignablerole_roleremoved);
		} 
	}
	return msg.channel.send(lang.removeselfassignablerole_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['rsar'],
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'removeselfassignablerole',
	description: 'Remove a role that allows users to assign themselves',
	usage: 'removeselfassignablerole {rolename}',
	example: ['removeselfassignablerole Member'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
