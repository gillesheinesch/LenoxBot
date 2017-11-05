exports.run = async(client, msg, args) => {	
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.commanddel === 'false') {
		tableload.commanddel = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send('Commands are now deleted after execution');
	} else {
		tableload.commanddel = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send('Commands are no longer deleted after execution');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['cmddel'],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'commanddel',
	description: 'Toggles the deletion of a command after execution',
	usage: 'commanddel',
	example: 'commanddel',
	category: 'administration',
    botpermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
};
