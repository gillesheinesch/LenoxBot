const Discord = require('discord.js');
const settings = require('../settings.json');
const guildsettingskeys = require('../guildsettings-keys.json');
exports.run = (client, guild) => {
	guildsettingskeys.prefix = settings.prefix;
	if (client.guildconfs.get(guild.id)) {
		const tableload = client.guildconfs.get(guild.id);

		for (const key in guildsettingskeys) {
			if (!tableload[key]) {
				tableload[key] = guildsettingskeys[key];
			}
		}

		for (let i = 0; i < client.commands.array().length; i++) {
			if (!tableload.commands[client.commands.array()[i].help.name]) {
				tableload.commands[client.commands.array()[i].help.name] = {
					name: client.commands.array()[i].help.name,
					status: 'true',
					bannedroles: [],
					bannedchannels: [],
					cooldown: '3000',
					ifBlacklistForRoles: 'true',
					ifBlacklistForChannels: 'true',
					whitelistedroles: [],
					whitelistedchannels: []
				};
			}
			if (!tableload.commands[client.commands.array()[i].help.name].ifBlacklistForRoles) {
				tableload.commands[client.commands.array()[i].help.name].ifBlacklistForRoles = 'true';
				tableload.commands[client.commands.array()[i].help.name].ifBlacklistForChannels = 'true';
				tableload.commands[client.commands.array()[i].help.name].whitelistedroles = [];
				tableload.commands[client.commands.array()[i].help.name].whitelistedchannels = [];
			}
		}
	}
	client.guildconfs.set(guild.id, guildsettingskeys);

	const embed1 = new Discord.RichEmbed()
		.setColor('#ccff33')
		.setDescription(`**Hello ${guild.owner.user.username},** \n\nYou can use the command **?modules** to see all modules of the bot \nTo see all commands of a module, just use **?commands {modulename}** \nTo see more details about a command, just use **?help {commandname}** \n\nIf you need any help you can join our discord server (https://lenoxbot.com/discord/) or visit our website (https://lenoxbot.com)`)
		.setAuthor('Thanks for choosing LenoxBot!', client.user.displayAvatarURL);

	guild.owner.send({
		embed: embed1
	});

	const embed = new Discord.RichEmbed()
		.setTimestamp()
		.setAuthor(`${guild.name} (${guild.id})`)
		.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
		.addField(`Channels`, `${guild.channels.size}`)
		.addField(`Members`, `${guild.memberCount}`)
		.setColor('GREEN')
		.setFooter('JOINED DISCORD SERVER');
	client.channels.get('497400159894896651').send({
		embed: embed
	});
};
