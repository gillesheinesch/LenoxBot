exports.run = (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply('You must run the commands on a Discord server on which the Discord Bot is available');
	const tableload = client.guildconfs.get(msg.guild.id);
	if (!msg.content.startsWith(tableload.prefix)) return;
	var command = msg.content.split(' ')[0].slice(tableload.prefix.length).toLowerCase();
	var args = msg.content.split(' ').slice(1);
	let cmd;
	if (client.commands.has(command)) {
		cmd = client.commands.get(command);
	} else if (client.aliases.has(command)) {
		cmd = client.commands.get(client.aliases.get(command));
	}
	if (cmd) {
		cmd.run(client, msg, args);
		if (tableload.commanddel === 'true') {
			msg.delete();
		}
	}
};
