exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const moduledeactivated = lang.deactivatemodule_moduledisabled.replace('%modulename', args.slice());

	if (args.slice().length === 0) return msg.channel.send(lang.deactivatemodule_noinput);

	const margs = msg.content.split(' ');
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'moderation', 'application', 'currency', 'partner', 'tickets', 'customcommands'];

	for (let i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'administration') {
				return msg.channel.send(lang.deactivatemodule_administration);
			} else if (margs[1].toLowerCase() === 'partner') {
				return msg.channel.send(lang.deactivatemodule_partner);
			} else if (margs[1].toLowerCase() === 'utility') {
				if (tableload.modules.utility === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.utility = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'music') {
				if (tableload.modules.music === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.music = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'fun') {
				if (tableload.modules.fun === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.fun = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'help') {
				if (tableload.modules.help === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.help = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'searches') {
				if (tableload.modules.searches === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.searches = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'nsfw') {
				if (tableload.modules.nsfw === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.nsfw = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'moderation') {
				if (tableload.modules.moderation === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.moderation = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'application') {
				if (tableload.modules.application === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.application = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'currency') {
				if (tableload.modules.currency === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.currency = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'customcommands') {
				if (tableload.modules.customcommands === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.customcommands = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			} else if (margs[1].toLowerCase() === 'tickets') {
				if (tableload.modules.tickets === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

				tableload.modules.tickets = 'false';
			    client.guildconfs.set(msg.guild.id, tableload);
				return msg.channel.send(moduledeactivated);
			}
		}
	}
	msg.channel.send(lang.deactivatemodule_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Modules',
	aliases: ['dm'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'deactivatemodule',
	description: 'Disables a module and its commands on a Discord server',
	usage: 'deactivatemodule {name of the module}',
	example: ['deactivatemodule help'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
