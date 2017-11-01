exports.run = async (client, msg, args) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');
	await msg.channel.send('The bot now restarts. See you soon! 👋');
	await client.guildconfs.close();
	await client.botconfs.close();
	await client.starboard.close();
	process.exit(42);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['reboot']
};
exports.help = {
	name: 'restart',
	description: 'Restart the bot',
	usage: 'restart',
	example: 'restart',
	category: 'botowner'
};
