exports.run = function(client, msg, args, lang) {
	let addedrole = args.slice(1).join(' ');
	let user = msg.mentions.members.first();
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

	if (msg.mentions.members.size < 1) return msg.reply(lang.addrole_nomention).then(m => m.delete(10000));
	if (addedrole.length < 1) return msg.reply(lang.addrole_norolename).then(m => m.delete(10000));
	if (!foundRole) return msg.reply(lang.addrole_rolenotexist).then(m => m.delete(10000));
	if (user.roles.has(foundRole.id)) return msg.reply(lang.addrole_memberalreadyhasrole).then(m => m.delete(10000));

	user.addRole(foundRole).then(() => msg.reply(lang.addrole_roleassigned).then(m => m.delete(10000))).catch(err =>
		msg.reply(lang.addrole_norights).then(m => m.delete(10000)));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['ar'],
<<<<<<< HEAD
    userpermissions: ['MANAGE_ROLES']
=======
    userpermissions: ['MANAGE_ROLES'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'addrole',
	description: 'Assign a role to a discord member',
	usage: 'addrole @User {rolename}',
	example: ['addrole @Monkeyyy11#7584 Member'],
	category: 'administration',
    botpermissions: ['MANAGE_ROLES', 'SEND_MESSAGES']
};
