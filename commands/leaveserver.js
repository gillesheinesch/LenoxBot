exports.run = (client, msg, args) => {
	let content = args.slice(1).join(' ');
	if (msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');
	if (isNaN(args)) return msg.channel.send('You must enter a guildid. For example: 783872987443').then(m => m.delete(10000));
	if (!content) return msg.channel.send('You must enter a guildid').then(m => m.delete(10000));
	client.guilds.get(args).leave();
	return msg.channel.send(`Successfully guild (${content}) left!`).then(m => m.delete(10000));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'leaveserver',
	description: 'Leaves a discord server by the guildid',
	usage: 'leaveserver {guildid}',
	example: 'leaveserver 8738704872894987',
	category: 'botowner'
};
