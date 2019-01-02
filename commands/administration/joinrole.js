const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const validation = ['add', 'list', 'remove'];
	const margs = msg.content.split(' ');
	const tableload = client.guildconfs.get(msg.guild.id);

	for (let i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'add') {
				if (!args || args.length === 0) return msg.reply(lang.joinrole_noinput);
				const mentionedRole = args.slice(1).join(' ');
				const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === mentionedRole.toLowerCase());
				if (!foundRole) return msg.reply(lang.joinrole_rolenotexist);

				if (tableload.joinroles.includes(foundRole.id)) return msg.reply(lang.joinrole_alreadyadded);

				if (tableload.joinroles.length >= 5) return msg.reply(lang.joinrole_maximum);

				tableload.joinroles.push(foundRole.id);
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.reply(lang.joinrole_roleadded);
			} else if (margs[1].toLowerCase() === 'remove') {
				if (!args || args.length === 0) return msg.reply(lang.joinrole_noinputremove);
				const mentionedRole = args.slice(1).join(' ');
				const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === mentionedRole.toLowerCase());
				if (!foundRole) return msg.reply(lang.joinrole_rolenotexist);

				if (!tableload.joinroles.includes(foundRole.id)) return msg.reply(lang.joinrole_notadded);

				const indexOfTheRole = tableload.joinroles.indexOf(foundRole.id);
				tableload.joinroles.splice(indexOfTheRole, 1);
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.reply(lang.joinrole_roleremoved);
			} else if (margs[1].toLowerCase() === 'list') {
				if (tableload.joinroles.length === 0) return msg.reply(lang.joinrole_nojoinroles);

				const joinroleEmbed = new Discord.RichEmbed()
					.setTimestamp()
					.setTitle(lang.joinrole_embedtitle)
					.setColor('BLUE');

				const arrayForEmbedDescription = [];
				for (let index = 0; index < tableload.joinroles.length; index++) {
					if (!msg.guild.roles.get(tableload.joinroles[index])) {
						const indexOfTheRole = tableload.joinroles.indexOf(tableload.joinroles[index]);
						tableload.joinroles.splice(indexOfTheRole, 1);
						client.guildconfs.set(msg.guild.id, tableload);
					}

					if (tableload.joinroles.length !== 0) {
						const joinrole = msg.guild.roles.get(tableload.joinroles[index]);
						arrayForEmbedDescription.push(`${joinrole.name} (${joinrole.id})`);
					}
				}
				client.guildconfs.set(msg.guild.id, tableload);
				joinroleEmbed.setDescription(arrayForEmbedDescription.join('\n'));

				return msg.channel.send({
					embed: joinroleEmbed
				});
			}
		}
	}
	const invalidvalidation = lang.joinrole_invalidvalidation.replace('%prefix', tableload.prefix);
	return msg.reply(invalidvalidation);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Roles',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'joinrole',
	description: 'Roles that new guildmembers will get when they join the Discord server',
	usage: 'joinrole {add, remove, list} [name of the role]',
	example: ['joinrole list', 'joinrole add test', 'joinrole remove test'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
