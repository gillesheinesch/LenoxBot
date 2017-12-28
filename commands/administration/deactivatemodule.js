const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.modules) {
        tableload.modules = {};
		tableload.modules.fun = 'true';
		tableload.modules.help = 'true';
		tableload.modules.moderation = 'true';
		tableload.modules.music = 'true';
		tableload.modules.nsfw = 'true';
		tableload.modules.searches = 'true';
		tableload.modules.utility = 'true';
		tableload.modules.application = 'true';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (args.slice().length === 0) return msg.channel.send('You forgot to enter the name of the module you want to disable.');

	const margs = msg.content.split(" ");
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'moderation', 'application'];

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "administration") {
				return msg.channel.send('Administration commands are always activated and cannot be disabled.');
			} else if (margs[1].toLowerCase() == "utility") {
				if (tableload.modules.utility === 'false') return msg.channel.send('This module is already disabled');
				
				tableload.modules.utility = 'false';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was disabled successfully!`);
			} else if (margs[1].toLowerCase() == "music") {
				if (tableload.modules.music === 'false') return msg.channel.send('This module is already disabled');
				
				tableload.modules.music = 'false';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was disabled successfully!`);
			} else if (margs[1].toLowerCase() == "fun") {
				if (tableload.modules.fun === 'false') return msg.channel.send('This module is already disabled');
				
				tableload.modules.fun = 'false';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was disabled successfully!`);
			} else if (margs[1].toLowerCase() == "help") {
				if (tableload.modules.help === 'false') return msg.channel.send('This module is already disabled');
				
				tableload.modules.help = 'false';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was disabled successfully!`);
			} else if (margs[1].toLowerCase() == "searches") {
				if (tableload.modules.searches === 'false') return msg.channel.send('This module is already disabled');
				
				tableload.modules.searches = 'false';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was disabled successfully!`);
			} else if (margs[1].toLowerCase() == "nsfw") {
				if (tableload.modules.nsfw === 'false') return msg.channel.send('This module is already disabled');
				
				tableload.modules.nsfw = 'false';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was disabled successfully!`);
			} else if (margs[1].toLowerCase() == "moderation") {
				if (tableload.modules.moderation === 'false') return msg.channel.send('This module is already disabled');
				
				tableload.modules.moderation = 'false';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was disabled successfully!`);
			} else if (margs[1].toLowerCase() == "application") {
				if (tableload.modules.application === 'false') return msg.channel.send('This module is already disabled');
				
				tableload.modules.application = 'false';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was disabled successfully!`);
			}
		}
	}
	msg.channel.send(`This module doesn't exist. Please make sure that you haven't mistyped!`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['dm'],
	userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'deactivatemodule',
	description: 'Disables a module and its commands on a Discord server',
	usage: 'deactivatemodule {modulename}',
	example: ['deactivatemodule help'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
