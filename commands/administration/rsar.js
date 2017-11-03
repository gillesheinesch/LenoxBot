exports.run = function(client, msg, args) {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));
	const tableload = client.guildconfs.get(msg.guild.id);
	let addedrole = args.slice().join(' ');
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());

	if (addedrole.length < 1) return msg.reply('You must specify the name of the role!').then(m => m.delete(10000));
	if (!foundRole) return msg.reply('Höh ... This role does not exist at all!').then(m => m.delete(10000));

	for (var i = 0; i < tableload.selfassignableroles.length; i++) {
		if (foundRole.id !== tableload.selfassignableroles[i]) {
			msg.channel.send('You did not add this role to the self-assignable roles!');
		}
	}
	const roleId = foundRole.id;
	try {
		for (var i = 0; i < tableload.selfassignableroles.length; i++) {
			if (roleId === tableload.selfassignableroles[i]) {
				tableload.selfassignableroles.splice(i, 1);
				client.guildconfs.set(msg.guild.id, tableload);
				client.guildconfs.close();
			}
		}
		client.guildconfs.set(msg.guild.id, tableload);
		client.guildconfs.close();
		return msg.channel.send('Role has been successfully removed from self-assignable roles!');
	} catch (error) {
		msg.channel.send(`You don't have self assignable roles so you can't remove one.`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['rsar']
};
exports.help = {
	name: 'rsar',
	description: 'Remove a role that allows users to assign themselves',
	usage: 'rsar {rolename}',
	example: 'rsar Member',
	category: 'administration'
};
