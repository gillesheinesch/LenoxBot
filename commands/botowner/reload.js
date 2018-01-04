exports.run = async(client, msg, args) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');
	if(!args || args.size < 1) return msg.reply("Must provide a command name to reload.");

	const input = args.slice();

	await delete require.cache[require.resolve(`../${input[0]}/${input[1]}.js`)];
	msg.reply(`The command ${args[1]} has been reloaded!`).then(m => m.delete(10000));
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
	example: ['reload ping'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};

