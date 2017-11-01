exports.run = (client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));
	
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.commanddel === 'false') {
		tableload.commanddel = 'true';
		client.guildconfs.set(msg.guild.id, tableload);
		return msg.channel.send('Commands are now deleted after execution');
	} else {
		tableload.commanddel = 'false';
		client.guildconfs.set(msg.guild.id, tableload);
		return msg.channel.send('Commands are no longer deleted after execution');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['cmddel']
};
exports.help = {
	name: 'commanddel',
	description: 'Toggles the deletion of a command after execution',
	usage: 'commanddel',
	example: 'commanddel',
	category: 'administration'
};
