exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	let addedrole = args.slice().join(' ');
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());

	if (addedrole.length < 1) return msg.reply('You must specify the name of the role!').then(m => m.delete(10000));
	if (!foundRole) return msg.reply('This role does not exist at all!').then(m => m.delete(10000));

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
		
				return msg.channel.send('Role has been successfully removed from self-assignable roles!');
		} 
	}
	return msg.channel.send('You did not add this role to the self-assignable roles!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['rsar'],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'removeselfassignablerole',
	description: 'Remove a role that allows users to assign themselves',
	usage: 'removeselfassignablerole {rolename}',
	example: ['removeselfassignablerole Member'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
