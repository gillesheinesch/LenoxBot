const Discord = require('discord.js');
const settings = require('../settings.json');
const guildsettingskeys = require('../guildsettings-keys.json');
exports.run = async (client, guild) => {
	if (!client.provider.isReady) return;
	guildsettingskeys.prefix = settings.prefix;

	if (client.provider.getGuild(guild.id, 'language')) { // Everything can be requested here
		const guildSettings = client.provider.guildSettings.get(guild.id);
		for (const key in guildsettingskeys) {
			if (!guildSettings[key] && guildSettings[key] === 'undefined') {
				guildSettings[key] = guildsettingskeys[key];
			}
		}
		await client.provider.setGuildComplete(guild.id, guildSettings);

		const currentCommands = client.provider.getGuild(guild.id, 'commands');
		for (let i = 0; i < client.registry.commands.array().length; i++) {
			if (!client.provider.getGuild(guild.id, 'commands')[client.registry.commands.array()[i].name]) {
				currentCommands[client.registry.commands.array()[i].name] = {
					name: client.registry.commands.array()[i].name,
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
			if (!currentCommands[client.registry.commands.array()[i].name].ifBlacklistForRoles) {
				currentCommands[client.registry.commands.array()[i].name].ifBlacklistForRoles = 'true';
				currentCommands[client.registry.commands.array()[i].name].ifBlacklistForChannels = 'true';
				currentCommands[client.registry.commands.array()[i].name].whitelistedroles = [];
				currentCommands[client.registry.commands.array()[i].name].whitelistedchannels = [];
			}
		}

		await client.provider.setGuild(guild.id, 'commands', currentCommands);
	} else {
		await client.provider.setGuildComplete(guild.id, guildsettingskeys);
	}


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
