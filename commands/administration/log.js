exports.run = async (client, msg, args, lang) => {
	const validation = ['chatfilter', 'modlog', 'messagedelete', 'messageupdate', 'channelupdate', 'channelcreate', 'channeldelete', 'memberupdate', 'presenceupdate', 'userjoin', 'userleft', 'rolecreate', 'roledelete', 'roleupdate', 'guildupdate'];
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(" ");
	const margs = msg.content.split(' ');

	var noinput = lang.log_noinput.replace('%prefix', tableload.prefix);
	if (!content) return msg.channel.send(noinput);

	for (var i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'messagedelete') {
				if (tableload.messagedellog === 'false') {
					tableload.messagedellogchannel = `${msg.channel.id}`;
					tableload.messagedellog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const messagedeleteset = lang.log_messagedeleteset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(messagedeleteset);
				} else {
					tableload.messagedellog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_messagedeletedeleted);
				}
			} else if (margs[1].toLowerCase() === 'messageupdate') {
				if (tableload.messageupdatelog === 'false') {
					tableload.messageupdatelogchannel = `${msg.channel.id}`;
					tableload.messageupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const messageupdateset = lang.log_messageupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(messageupdateset);
				} else {
					tableload.messageupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_messageupdatedeleted);
				}
			} else if (margs[1].toLowerCase() === 'channelupdate') {
				if (tableload.channelupdatelog === 'false') {
					tableload.channelupdatelogchannel = `${msg.channel.id}`;
					tableload.channelupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const channelupdateset = lang.log_channelupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(channelupdateset);
				} else {
					tableload.channelupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_channelupdatedeleted);
				}
			} else if (margs[1].toLowerCase() === 'memberupdate') {
				if (tableload.guildmemberupdatelog === 'false') {
					tableload.guildmemberupdatelogchannel = `${msg.channel.id}`;
					tableload.guildmemberupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const memberupdateset = lang.log_memberupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(memberupdateset);
				} else {
					tableload.guildmemberupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_memberupdatedeleted);
				}
			} else if (margs[1].toLowerCase() === 'channelcreate') {
				if (tableload.channelcreatelog === 'false') {
					tableload.channelcreatelogchannel = `${msg.channel.id}`;
					tableload.channelcreatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const channelcreateset = lang.log_channelcreateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(channelcreateset);
				} else {
					tableload.channelcreatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_channelcreatedeleted);
				}
			} else if (margs[1].toLowerCase() === 'channeldelete') {
				if (tableload.channeldeletelog === 'false') {
					tableload.channeldeletelogchannel = `${msg.channel.id}`;
					tableload.channeldeletelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const channeldeleteset = lang.log_channeldeleteset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(channeldeleteset);
				} else {
					tableload.channeldeletelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_channeldeletedeleted);
				}
			} else if (margs[1].toLowerCase() === 'userjoin') {
				if (tableload.welcomelog === 'false') {
					tableload.welcomelogchannel = `${msg.channel.id}`;
					tableload.welcomelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const userjoinset = lang.log_userjoinset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(userjoinset);
				} else {
					tableload.welcomelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_userjoindeleted);
				}
			} else if (margs[1].toLowerCase() === 'userleft') {
				if (tableload.byelog === 'false') {
					tableload.byelogchannel = `${msg.channel.id}`;
					tableload.byelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const userleftset = lang.log_userleftset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(userleftset);
				} else {
					tableload.byelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_userleftdeleted);
				}
			} else if (margs[1].toLowerCase() === 'modlog') {
				if (tableload.modlog === 'false') {
					tableload.modlogchannel = `${msg.channel.id}`;
					tableload.modlog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const modlogset = lang.log_modlogset.replace('%chnanelname', `**#${msg.channel.name}**`);
					return msg.channel.send(modlogset);
				} else {
					tableload.modlog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_modlogdeleted);
				}
			} else if (margs[1].toLowerCase() === 'rolecreate') {
				if (tableload.rolecreatelog === 'false') {
					tableload.rolecreatelogchannel = `${msg.channel.id}`;
					tableload.rolecreatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const rolecreateset = lang.log_rolecreateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(rolecreateset);
				} else {
					tableload.rolecreatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_rolecreatedeleted);
				}
			} else if (margs[1].toLowerCase() === 'roledelete') {
				if (tableload.roledeletelog === 'false') {
					tableload.roledeletelogchannel = `${msg.channel.id}`;
					tableload.roledeletelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const roledeleteset = lang.log_roledeleteset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(roledeleteset);
				} else {
					tableload.roledeletelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_roledeletedeleted);
				}
			} else if (margs[1].toLowerCase() === 'roleupdate') {
				if (tableload.roleupdatelog === 'false') {
					tableload.roleupdatelogchannel = `${msg.channel.id}`;
					tableload.roleupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const roleupdateset = lang.log_roleupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(roleupdateset);
				} else {
					tableload.roleupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_roleupdatedeleted);
				}
			} else if (margs[1].toLowerCase() === 'presenceupdate') {
				if (tableload.presenceupdatelog === 'false') {
					tableload.presenceupdatelogchannel = `${msg.channel.id}`;
					tableload.presenceupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const presenceupdateset = lang.log_presenceupdateset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(presenceupdateset);
				} else {
					tableload.presenceupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_presenceupdatedeleted);
				}
			} else if (margs[1].toLowerCase() === 'guildupdate') {
				if (tableload.guildupdatelog === 'false') {
					tableload.guildupdatelogchannel = `${msg.channel.id}`;
					tableload.guildupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const guildupdateset = lang.log_guildupdateset.replace('%channelname', `**#${msg.channel.name}**`)
					return msg.channel.send(guildupdateset);
				} else {
					tableload.guildupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_guildupdatedeleted);
				}
			} else if (margs[1].toLowerCase() === 'chatfilter') {
				if (tableload.chatfilterlog === 'false') {
					tableload.chatfilterlogchannel = `${msg.channel.id}`;
					tableload.chatfilterlog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);

					const chatfilterset = lang.log_chatfilterset.replace('%channelname', `**#${msg.channel.name}**`);
					return msg.channel.send(chatfilterset);
				} else {
					tableload.chatfilterlog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);

					return msg.channel.send(lang.log_chatfilterdeleted);
				}
			}
		}
	}
	const error = lang.log_error.replace('%prefix', tableload.prefix);
	msg.channel.send(error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
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
