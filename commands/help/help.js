exports.run = (client, msg, args) => {
	const Discord = require('discord.js');
	const prefix = client.guildconfs.get(msg.guild.id).prefix;
	if (!args[0]) {
		const embed = new Discord.RichEmbed()
		.addField('To add this bot to your Discordserver:', `https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8`)
		.addField('Any questions/suggestions/bugs, join our discord server:', `https://discord.gg/5mpwCr8`)
		.addField('To see all modules of the bot:', `${prefix}modules`)
		.addField('To see all commands in a module:', `${prefix}commands {modulename}`)
		.addField('To see more details about a command:', `${prefix}help {commandname}`)
		.setColor('#ff3300')
		.setAuthor(client.user.username, client.user.displayAvatarURL);
	
		msg.channel.send({ embed });
		return msg.channel.send('For mobile users who can not click on links: \nInvite Bot: https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8\nDiscord server: https://discord.gg/5mpwCr8');
	} else {
		let command = args[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);
			return msg.channel.send(`=== ${command.help.name} === \n\nDescription :: ${command.help.description}\n\nUsage :: ${prefix}${command.help.usage} \nExample :: ${prefix}${command.help.example} \n\nAlias :: ${prefix}${command.conf.aliases}`, { code:'asciidoc' });
		} else if (client.aliases.has(command)) {
			command = client.commands.get(client.aliases.get(command));
			return msg.channel.send(`=== ${command.help.name} === \n\nDescription :: ${command.help.description}\n\nUsage :: ${prefix}${command.help.usage} \nExample :: ${prefix}${command.help.example} \n\nAlias :: ${prefix}${command.conf.aliases}`, { code:'asciidoc' });
		}
	}
	msg.channel.send('This command name or command alias doesn\'t exist');
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
