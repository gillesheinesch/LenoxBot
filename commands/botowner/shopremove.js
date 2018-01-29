exports.run = async(client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
    const tableload = client.botconfs.get('botconfs');

	if (!tableload.shopitems) {
		tableload.shopitems = [];
		await client.botconfs.set('botconfs', tableload);
	}

	let addedrole = args.slice().join(' ');

	if (addedrole.length < 1) return msg.reply('You forgot to enter a rolename').then(m => m.delete(10000));

	let roleinput = args.slice().join(" ");
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === roleinput.toLowerCase());
	if (!foundRole) return msg.reply('This role does not exist').then(m => m.delete(10000));

	for (var i = 0; i < tableload.shopitems.length; i += 2) {
		if (foundRole.id === tableload.shopitems[i]) {
			const roleId = foundRole.id;
				for (var i = 0; i < tableload.shopitems.length; i += 2) {
					if (roleId === tableload.shopitems[i]) {
						tableload.shopitems.splice(i, 2);
						await client.botconfs.set('botconfs', tableload);
					}
				}
				await client.guildconfs.set('botconfs', tableload);
				return msg.channel.send('Role removed!');
		}
	}
	return msg.channel.send('There was an error!');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'shopremove',
	description: 'Sets a status of the Discord Bots',
	usage: 'setgame {text}',
    example: ['setgame LenoxBot'],
    category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
