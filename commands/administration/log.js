exports.run = (client, msg, args, lang) => {
	const validation = ['chatfilter', 'modlog', 'messagedelete', 'messageupdate', 'channelupdate', 'channelcreate', 'channeldelete', 'memberupdate', 'presenceupdate', 'userjoin', 'userleft', 'rolecreate', 'roledelete', 'roleupdate', 'guildupdate'];
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(' ');
	const margs = msg.content.split(' ');

	const noinput = lang.log_noinput.replace('%prefix', tableload.prefix);
	if (!content) return msg.channel.send(noinput);

	for (let i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'messagedelete') {
				if (tableload.messagedellog === 'false') {
					tableload.messagedellogchannel = `${msg.channel.id}`;
					tableload.messagedellog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const messagedeleteset = lang.log_messagedeleteset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(messagedeleteset);
				}
				tableload.messagedellog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_messagedeletedeleted);
			} else if (margs[1].toLowerCase() === 'messageupdate') {
				if (tableload.messageupdatelog === 'false') {
					tableload.messageupdatelogchannel = `${msg.channel.id}`;
					tableload.messageupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const messageupdateset = lang.log_messageupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(messageupdateset);
				}
				tableload.messageupdatelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_messageupdatedeleted);
			} else if (margs[1].toLowerCase() === 'channelupdate') {
				if (tableload.channelupdatelog === 'false') {
					tableload.channelupdatelogchannel = `${msg.channel.id}`;
					tableload.channelupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const channelupdateset = lang.log_channelupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(channelupdateset);
				}
				tableload.channelupdatelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_channelupdatedeleted);
			} else if (margs[1].toLowerCase() === 'memberupdate') {
				if (tableload.guildmemberupdatelog === 'false') {
					tableload.guildmemberupdatelogchannel = `${msg.channel.id}`;
					tableload.guildmemberupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const memberupdateset = lang.log_memberupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(memberupdateset);
				}
				tableload.guildmemberupdatelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_memberupdatedeleted);
			} else if (margs[1].toLowerCase() === 'channelcreate') {
				if (tableload.channelcreatelog === 'false') {
					tableload.channelcreatelogchannel = `${msg.channel.id}`;
					tableload.channelcreatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const channelcreateset = lang.log_channelcreateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(channelcreateset);
				}
				tableload.channelcreatelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_channelcreatedeleted);
			} else if (margs[1].toLowerCase() === 'channeldelete') {
				if (tableload.channeldeletelog === 'false') {
					tableload.channeldeletelogchannel = `${msg.channel.id}`;
					tableload.channeldeletelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const channeldeleteset = lang.log_channeldeleteset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(channeldeleteset);
				}
				tableload.channeldeletelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_channeldeletedeleted);
			} else if (margs[1].toLowerCase() === 'userjoin') {
				if (tableload.welcomelog === 'false') {
					tableload.welcomelogchannel = `${msg.channel.id}`;
					tableload.welcomelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const userjoinset = lang.log_userjoinset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(userjoinset);
				}
				tableload.welcomelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_userjoindeleted);
			} else if (margs[1].toLowerCase() === 'userleft') {
				if (tableload.byelog === 'false') {
					tableload.byelogchannel = `${msg.channel.id}`;
					tableload.byelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const userleftset = lang.log_userleftset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(userleftset);
				}
				tableload.byelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_userleftdeleted);
			} else if (margs[1].toLowerCase() === 'modlog') {
				if (tableload.modlog === 'false') {
					tableload.modlogchannel = `${msg.channel.id}`;
					tableload.modlog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const modlogset = lang.log_modlogset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(modlogset);
				}
				tableload.modlog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_modlogdeleted);
			} else if (margs[1].toLowerCase() === 'rolecreate') {
				if (tableload.rolecreatelog === 'false') {
					tableload.rolecreatelogchannel = `${msg.channel.id}`;
					tableload.rolecreatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const rolecreateset = lang.log_rolecreateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(rolecreateset);
				}
				tableload.rolecreatelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_rolecreatedeleted);
			} else if (margs[1].toLowerCase() === 'roledelete') {
				if (tableload.roledeletelog === 'false') {
					tableload.roledeletelogchannel = `${msg.channel.id}`;
					tableload.roledeletelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const roledeleteset = lang.log_roledeleteset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(roledeleteset);
				}
				tableload.roledeletelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_roledeletedeleted);
			} else if (margs[1].toLowerCase() === 'roleupdate') {
				if (tableload.roleupdatelog === 'false') {
					tableload.roleupdatelogchannel = `${msg.channel.id}`;
					tableload.roleupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const roleupdateset = lang.log_roleupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(roleupdateset);
				}
				tableload.roleupdatelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_roleupdatedeleted);
			} else if (margs[1].toLowerCase() === 'presenceupdate') {
				if (tableload.presenceupdatelog === 'false') {
					tableload.presenceupdatelogchannel = `${msg.channel.id}`;
					tableload.presenceupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const presenceupdateset = lang.log_presenceupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(presenceupdateset);
				}
				tableload.presenceupdatelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_presenceupdatedeleted);
			} else if (margs[1].toLowerCase() === 'guildupdate') {
				if (tableload.guildupdatelog === 'false') {
					tableload.guildupdatelogchannel = `${msg.channel.id}`;
					tableload.guildupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const guildupdateset = lang.log_guildupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(guildupdateset);
				}
				tableload.guildupdatelog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_guildupdatedeleted);
			} else if (margs[1].toLowerCase() === 'chatfilter') {
				if (tableload.chatfilterlog === 'false') {
					tableload.chatfilterlogchannel = `${msg.channel.id}`;
					tableload.chatfilterlog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);

					const chatfilterset = lang.log_chatfilterset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(chatfilterset);
				}
				tableload.chatfilterlog = 'false';
				client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(lang.log_chatfilterdeleted);
			}
		}
	}
	const error = lang.log_error.replace('%prefix', tableload.prefix);
	msg.channel.send(error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Events',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'log',
	description: 'Allows you to log for different channels, different events. Use ?listevents to get a list of all events',
	usage: 'log {name of the event}',
	example: ['log modlog'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
