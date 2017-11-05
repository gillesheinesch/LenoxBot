exports.run = (client, msg, args) => {
	const prefix = client.guildconfs.get(msg.guild.id).prefix;
	if (!args[0]) {
		msg.channel.send(`To add this bot to your Discordserver, use this link: https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8 \n\nYou can use the command \`${prefix}modules\` to see all modules of the bot\nTo see all commands of a module, just use \`${prefix}commands modulename\` \nTo see more details about a command, just use \`${prefix}help commandname\` \n\nYou can join our discord server: **www.discord.gg/5mpwCr8**`);
	} else {
		let command = args[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);
			msg.channel.sendCode('asciidoc', `=== ${command.help.name} === \n\nDescription :: ${command.help.description}\n\nUsage :: ${prefix}${command.help.usage} \nExample :: ${prefix}${command.help.example} \n\nAlias :: ${prefix}${command.conf.aliases}`);
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['h'],
    userpermissions: []
};
exports.help = {
	name: 'help',
	description: 'Gives you informations about a command',
	usage: 'help {commandname}',
	example: 'help botinfo',
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};
