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

	if (args.slice().length === 0) return msg.channel.send('You forgot to enter the name of the module you wanted to reactivate!');

	const margs = msg.content.split(" ");
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'moderation', 'application'];

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "administration") {
				msg.channel.send('Administration commands are always activated!');
			} else if (margs[1].toLowerCase() == "utility") {
				if (tableload.modules.utility = 'true') return msg.channel.send('This module is already activated');
				
				tableload.modules.utility = 'true';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was activated successfully!`);
			} else if (margs[1].toLowerCase() == "music") {
				if (tableload.modules.music === 'true') return msg.channel.send('This module is already activated');
				
				tableload.modules.music = 'true';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was activated successfully!`);
			} else if (margs[1].toLowerCase() == "fun") {
				if (tableload.modules.fun === 'true') return msg.channel.send('This module is already activated');
				
				tableload.modules.fun = 'true';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was activated successfully!`);
			} else if (margs[1].toLowerCase() == "help") {
				if (tableload.modules.help === 'true') return msg.channel.send('This module is already activated');
				
				tableload.modules.help = 'true';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was activated successfully!`);
			} else if (margs[1].toLowerCase() == "searches") {
				if (tableload.modules.searches === 'true') return msg.channel.send('This module is already activated');
				
				tableload.modules.searches = 'true';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was activated successfully!`);
			} else if (margs[1].toLowerCase() == "nsfw") {
				if (tableload.modules.nsfw === 'true') return msg.channel.send('This module is already activated');
				
				tableload.modules.nsfw = 'true';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was activated successfully!`);
			} else if (margs[1].toLowerCase() == "moderation") {
				if (tableload.modules.moderation === 'true') return msg.channel.send('This module is already activated');
				
				tableload.modules.moderation = 'true';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was activated successfully!`);
			} else if (margs[1].toLowerCase() == "application") {
				if (tableload.modules.application === 'true') return msg.channel.send('This module is already activated');
				
				tableload.modules.application = 'true';
			    await client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(`${args.slice()} module was activated successfully!`);
			}
		}
	}
	msg.channel.send(`This module doesn't exist. Please make sure that you haven't mistyped!`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['am'],
	userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'activatemodule',
	description: 'Activates a module and its commands on a Discord server',
	usage: 'activatemodule {modulename}',
	example: ['activatemodule help'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
