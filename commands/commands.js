const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'botowner'];
	const margs = msg.content.split(" ");
	const commandNames = Array.from(client.commands.keys());
	const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
	const embed = new Discord.RichEmbed()
	.setColor('#0066CC')
	.setDescription(`For more information about a command, type in ${tableload.prefix}help {commandname}`);
	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "administration") {
				msg.channel.send(`${client.commands.filter(c => c.help.category === "administration").map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "utility") {
				msg.channel.send(`${client.commands.filter(c => c.help.category === "utility").map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "music") {
				return msg.channel.send('Music commands are not available yet!');
				// msg.channel.send(`${client.commands.filter(c => c.help.category === "music").map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
		        // return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "fun") {
				msg.channel.send(`${client.commands.filter(c => c.help.category === "fun").map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "help") {
				msg.channel.send(`${client.commands.filter(c => c.help.category === "help").map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "searches") {
				msg.channel.send(`${client.commands.filter(c => c.help.category === "searches").map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "botowner") {
				msg.channel.send(`${client.commands.filter(c => c.help.category === "botowner").map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "nsfw") {
				return msg.channel.send('NSFW commands are not available yet!');
				// msg.channel.send(`${client.commands.filter(c => c.help.category === "nsfw").map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
                // return msg.channel.send({ embed: embed });
			}
		}
	}
	msg.channel.send(`There was an error. See ${tableload.prefix}modules to get a list of all available modules that you can use!`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['cmds']
};
exports.help = {
	name: 'commands',
	description: 'All commands of a module',
	usage: 'commands {Modulename}',
	example: 'commands Help',
	category: 'help'
};

