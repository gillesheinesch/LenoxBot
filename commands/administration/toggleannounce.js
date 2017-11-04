exports.run = async(client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));
	const tableload = client.guildconfs.get(msg.guild.id);
	const channelid = msg.channel.id;
	if (tableload.announce === 'false') {
		tableload.announce = 'true'
		tableload.announcechannel = channelid;
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(`Announcements are now posted in the channel **#${msg.channel.name}**`);
	} else {
		tableload.announce = 'false';
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send('Announcements are now no longer posted!');
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['ta']
};
exports.help = {
	name: 'toggleannounce',
	description: 'Sets a channel for announcements, where you can use the `announce`-command',
	usage: 'toggleannounce',
	example: 'toggleannounce',
	category: 'administration'
};
