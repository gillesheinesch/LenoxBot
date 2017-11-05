exports.run = (client, msg, args) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');
	if(!args || args.size < 1) return msg.reply("Must provide a command name to reload.");
	delete require.cache[require.resolve(`./${args[0]}.js`)];
	msg.reply(`The command ${args[0]} has been reloaded!`).then(m => m.delete(10000));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'reload',
	description: 'Discord',
	usage: 'reload {command}',
	example: 'reload ping',
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};

