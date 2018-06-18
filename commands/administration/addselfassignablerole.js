exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	let addedrole = args.slice().join(' ');
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());

	if (addedrole.length < 1) return msg.reply(lang.addselfassignablerole_norolename).then(m => m.delete(10000));
	if (!foundRole) return msg.reply(lang.addselfassignablerole_rolenotexist).then(m => m.delete(10000));
		for (var i = 0; i < tableload.selfassignableroles.length; i++) {
			if (foundRole.id === tableload.selfassignableroles[i]) return msg.channel.send(lang.addselfassignablerole_alreadyadded);
		}
		const roleId = foundRole.id;
		tableload.selfassignableroles.push(roleId);
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.addselfassignablerole_roleset);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['asar'],
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'addselfassignablerole',
	description: 'Add a role that allows users to assign themselves',
	usage: 'addselfassignablerole {rolename}',
	example: ['addselfassignablerole Member'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
