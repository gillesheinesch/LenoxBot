exports.run = (client, msg, args, lang) => {
	const Discord = require('discord.js');
	const prefix = client.guildconfs.get(msg.guild.id).prefix;

	if (!args[0]) {
		const embed = new Discord.RichEmbed()
		.addField(lang.help_addthebot, `https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8`)
		.addField(lang.help_discordserver, `https://discord.gg/PjZM36X`)
		.addField(lang.help_modulecommand, `${prefix}modules`)
		.addField(lang.help_commandscommand, `${prefix}commands {modulename}`)
		.addField(lang.help_helpcommand, `${prefix}help {commandname}`)
		.addField(lang.help_documentation, 'https://www.lenoxbot.com/')
		.setColor('#ff3300')
		.setAuthor(client.user.username, client.user.displayAvatarURL);
	
		return msg.channel.send({ embed });
	} else {
		let command = args[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);

			if (command.help.category == 'botowner' && msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');
			if (command.help.category == 'staff' && !msg.member.roles.get('386627285119402006')) return msg.channel.send('You dont have permissions to execute this command!');

			var aliases = [];
			if (command.conf.aliases.length !== 0) {
				for (var i = 0; i < command.conf.aliases.length; i++) {
					aliases.push(`${prefix}${command.conf.aliases[i]}`);
				}
			}

			var examples = [];
			if (command.help.example.length !== 0) {
				for (var i = 0; i < command.help.example.length; i++) {
					examples.push(`${prefix}${command.help.example[i]}`);
				}
			}

			var category = lang.help_category.replace('%category', command.help.category);
			const commandembed = new Discord.RichEmbed()
			.setColor('#45A081')
			.setAuthor(`${prefix}${command.conf.aliases.length !== 0 ? `${command.help.name} / ` : command.help.name} ${aliases.join(" / ")}`)
			.setDescription(lang[`${command.help.name}_description`])
			.addField(lang.help_usage, prefix + command.help.usage)
			.addField(lang.help_example, examples.join("\n"))
			.setFooter(category);
		
			return msg.channel.send({ embed: commandembed });
		} else if (client.aliases.has(command)) {
			command = client.commands.get(client.aliases.get(command));

			if (command.help.category == 'botowner' && msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');
			if (command.help.category == 'staff' && !msg.member.roles.get('386627285119402006')) return msg.channel.send('You dont have permissions to execute this command!');

			var aliases = [];
			if (command.conf.aliases.length !== 0) {
				for (var i = 0; i < command.conf.aliases.length; i++) {
					aliases.push(`${prefix}${command.conf.aliases[i]}`);
				}
			}

			var examples = [];
			if (command.help.example.length !== 0) {
				for (var i = 0; i < command.help.example.length; i++) {
					examples.push(`${prefix}${command.help.example[i]}`);
				}
			}

			var category = lang.help_category.replace('%category', command.help.category);
			const aliasembed = new Discord.RichEmbed()
			.setColor('#45A081')
			.setAuthor(`${prefix}${command.conf.aliases.length !== 0 ? `${command.help.name} / ` : command.help.name} ${aliases.join(" / ")}`)
			.setDescription(lang[`${command.help.name}_description`])
			.addField(lang.help_usage, prefix + command.help.usage)
			.addField(lang.help_example, examples.join("\n"))
			.setFooter(category);
			return msg.channel.send({ embed: aliasembed });
		}
	}
	msg.channel.send(lang.help_error);
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
	example: ['help botinfo', 'help'],
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};
