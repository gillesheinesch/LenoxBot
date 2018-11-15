exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const moduleactivated = lang.activatemodule_moduleactivated.replace('%modulename', args.slice());

	if (args.slice().length === 0) return msg.channel.send(lang.activatemodule_noinput);

	const margs = msg.content.split(' ');
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'moderation', 'application', 'currency', 'partner', 'tickets', 'customcommands'];

	for (let i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'administration') {
				return msg.channel.send(lang.activatemodule_administration);
			} else if (margs[1].toLowerCase() === 'partner') {
				return msg.channel.send(lang.activatemodule_partner);
			} else if (margs[1].toLowerCase() === 'utility') {
				if (tableload.modules.utility === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.utility = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'music') {
				if (tableload.modules.music === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.music = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'fun') {
				if (tableload.modules.fun === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.fun = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'help') {
				if (tableload.modules.help === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.help = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'searches') {
				if (tableload.modules.searches === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.searches = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'nsfw') {
				if (tableload.modules.nsfw === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.nsfw = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'moderation') {
				if (tableload.modules.moderation === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.moderation = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'application') {
				if (tableload.modules.application === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.application = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'currency') {
				if (tableload.modules.currency === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.currency = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'customcommands') {
				if (tableload.modules.customcommands === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.customcommands = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			} else if (margs[1].toLowerCase() === 'tickets') {
				if (tableload.modules.tickets === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

				tableload.modules.tickets = 'true';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduleactivated);
			}
		}
	}
	return msg.channel.send(lang.activatemodule_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Modules',
	aliases: ['am'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'activatemodule',
	description: 'Activates a module and its commands on a Discord server',
	usage: 'activatemodule {name of the module}',
	example: ['activatemodule help'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
