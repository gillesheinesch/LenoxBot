exports.run = async(client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
    const tableload = client.botconfs.get('botconfs');
	
	if (!tableload.shopitems) {
		tableload.shopitems = [];
		await client.botconfs.set('botconfs', tableload);
	}

	let input = args.slice();

	if (!input[0]) return msg.reply('You forgot to enter the rolename and the required number of medals to buy this role').then(m => m.delete(10000));
	if (parseInt(input[0]) <= 0) return msg.reply('The number can not be 0 or less');
	if (!args.slice(1).join(" ")) return msg.reply('You forgot to enter the rolename').then(m => m.delete(10000));

	let roleinput = args.slice(1).join(" ");
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === roleinput.toLowerCase());
	if (!foundRole) return msg.reply('This role does not exist').then(m => m.delete(10000));

		for (var i = 0; i < tableload.shopitems.length;  i += 2) {
			if (foundRole.id === tableload.shopitems[i]) return msg.channel.send('Role already added');
		}
		const roleId = foundRole.id;
		tableload.shopitems.push(roleId);
		tableload.shopitems.push(input[0]);
		await client.botconfs.set('botconfs', tableload);
		
		return msg.channel.send('Role added!');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'shopadd',
	description: 'Sets a status of the Discord Bots',
	usage: 'setgame {text}',
    example: ['setgame LenoxBot'],
    category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
