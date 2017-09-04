exports.run = (client, msg, args) => {
	const prefix = client.guildconfs.get(msg.guild.id).prefix;
	if (!args[0]) {
		msg.channel.send('To add this bot to your Discordserver, use this link: www.lenoxbotsoon.com \n\nYou can use the command `?modules` to see all modules of the bot\nTo see all commands of a module, just use `?commands modulename` \nTo see more details about a command, just use `?help commandname` \n\nYou can join our discord server: **https://discord.gg/5mpwCr8**');
	} else {
		let command = args[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);
			msg.channel.sendCode('asciidoc', `= ${command.help.name} = \n\n${command.help.description}\n\nusage :: ${prefix}${command.help.usage} \nexample :: ${prefix}${command.help.example} \n\nalias :: ${prefix}${command.conf.aliases}`);
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['h']
};
exports.help = {
	name: 'help',
	description: 'Gives you informations about a command',
	usage: 'help {commandname}',
	example: 'help botinfo',
	category: 'help'
};
