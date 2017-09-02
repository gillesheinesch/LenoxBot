const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const validation = ['administration', 'help', 'music', 'minigames', 'searches', 'nsfw', 'utility'];
	const prefixload = client.guildconfs.get(msg.guild.id).prefix;
	const margs = msg.content.split(" ");
	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "administration") {
				const embed = new Discord.RichEmbed()
				.setFooter('All commands of the module "Administration"')
				.setAuthor('Command List of Administration')
				.addField(`${prefixload}ban`, 'Ban a user from the discord server\n with a certain reason', true)
				.addField(`${prefixload}unban`, 'Unban a user from the discord server\n with a certain reason', true)
				.addField(`${prefixload}kick`, 'Kick a user from the discord server with a certain reason')
				.addField(`${prefixload}warn`, 'Warn a user on the discord server with a certain reason')
				.addField(`${prefixload}clear`, 'Deletes for you the last X messages that were sent in the current channel')
				.addField(`${prefixload}modlog`, 'Toggles the anouncements on the current channel when a user get banned, kicked, warned or unbaned on discord server')
				.addField(`${prefixload}welcome`, 'Toggles the anouncements on the current channel when a user joins the discord server')
				.addField(`${prefixload}bye`, 'Toggles the anouncements on the current channel when a user leaves the discord server')
				.addField(`${prefixload}prefix`, 'Changes the prefix of the server')
				.setColor('#0066CC');
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "utility") {
				const embed = new Discord.RichEmbed()
				.setFooter('All commands of the module "Administration"')
				.setAuthor('Command List of Administration')
				.addField(`${prefixload}botinfo`, 'Information about the bot')
				.addField(`${prefixload}serverinfo`, 'Shows you some information about the current discord server')
				.addField(`${prefixload}userinfo`, 'Gives you information about you or another user')
				.addField(`${prefixload}calculator`, 'Calculates for you an calculation')
				.addField(`${prefixload}randomnumber`, 'Selects a random number between your input and 1')
				.addField(`${prefixload}weather`, 'weather of a town or a city')
				.addField(`${prefixload}channels`, 'A list of all channels on your discord server')
				.setColor('#0066CC');
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "music") {
				return msg.channel.send('Music commands are not available yet!');
			} else if (margs[1].toLowerCase() == "minigames") {
				const embed = new Discord.RichEmbed()
				.setFooter('All commands of the module "Minigames"')
				.setAuthor('Command List of Minigames')
				.addField(`${prefixload}slot`, 'Play with the slot machine')
				.setColor('#0066CC');
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "help") {
				const embed = new Discord.RichEmbed()
				.setFooter('All commands of the module "Help"')
				.setAuthor('Command List of Help')
				.addField(`${prefixload}help`, 'Gives you informations about a command')
				.addField(`${prefixload}modules`, 'Gives you a list of all modules')
				.addField(`${prefixload}commands`, 'All commands of a module')
				.setColor('#0066CC');
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "searches") {
				const embed = new Discord.RichEmbed()
				.setFooter('All commands of the module "Searches"')
				.setAuthor('Command List of Searches')
				.addField(`${prefixload}google`, 'Searches something on google')
				.addField(`${prefixload}gif`, 'Searches for a gif')
				.addField(`${prefixload}overwatch`, 'Shows you overwatch-stats about a Overwatch player')
				.setColor('#0066CC');
				return msg.channel.send({ embed: embed });
			} else if (margs[1].toLowerCase() == "nsfw") {
				return msg.channel.send('NSFW commands are not available yet!');
			}
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'commands',
	description: 'All commands of a module',
    usage: 'commands {Modulename}',
    example: 'commands Help'
};

