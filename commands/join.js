exports.run = function(client, msg, args) {
	const tableload = client.guildconfs.get(msg.guild.id);
	let addedrole = args.slice().join(' ');
    const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());
    const author = msg.guild.members.get(msg.author.id);

	if (addedrole.length < 1) return msg.reply('You must specify the name of the role!').then(m => m.delete(10000));
    if (!foundRole) return msg.reply('Höh ... This role does not exist at all!').then(m => m.delete(10000));
    if (msg.member.roles.has(foundRole.id)) return msg.reply('You already have this role!');

for (var i = 0; i < tableload.selfassignableroles.length; i++) {
	if (foundRole.id === tableload.selfassignableroles[i]) {
            author.addRole(foundRole).then(m => m.channel.send('Role successfully assigned!')).catch(msg.channel.send('I don\'t have the necessary rights to give you this role. Please take a look at the rights of your roles and the order of your roles!'));
    }
}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'join',
	description: 'Join a self-assignable role',
	usage: 'join {rolename}',
	example: 'join Member',
	category: 'utility'
};
