exports.run = async(client, msg, args, lang) => {	
	const validation = ['modlog', 'messagedelete', 'messageupdate', 'channelupdate', 'channelcreate', 'channeldelete', 'memberupdate', 'presenceupdate', 'userjoin', 'userleft', 'rolecreate', 'roledelete', 'roleupdate', 'guildupdate'];
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(" ");
	const margs = msg.content.split(' ');

	var noinput = lang.log_noinput.replace('%prefix', tableload.prefix);
	if (!content) return msg.channel.send(noinput);

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'messagedelete') {
				if (tableload.messagedellog === 'false') {
					tableload.messagedellogchannel = `${msg.channel.id}`;
					tableload.messagedellog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_messagedeleteset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.messagedellog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_messagedeletedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'messageupdate') {
				if (tableload.messageupdatelog === 'false') {
					tableload.messageupdatelogchannel = `${msg.channel.id}`;
					tableload.messageupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_messageupdateset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.messageupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_messageupdatedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'channelupdate') {
				if (tableload.channelupdatelog === 'false') {
					tableload.channelupdatelogchannel = `${msg.channel.id}`;
					tableload.channelupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_channelupdateset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.channelupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_channelupdatedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'memberupdate') {
				if (tableload.guildmemberupdatelog === 'false') {
					tableload.guildmemberupdatelogchannel = `${msg.channel.id}`;
					tableload.guildmemberupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_memberupdateset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.guildmemberupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_memberupdatedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'channelcreate') {
				if (tableload.channelcreatelog === 'false') {
					tableload.channelcreatelogchannel = `${msg.channel.id}`;
					tableload.channelcreatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_channelcreateset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.channelcreatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_channelcreatedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'channeldelete') {
				if (tableload.channeldeletelog === 'false') {
					tableload.channeldeletelogchannel = `${msg.channel.id}`;
					tableload.channeldeletelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_channeldeleteset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.channeldeletelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_channeldeletedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'userjoin') {
				if (tableload.welcomelog === 'false') {
					tableload.welcomelogchannel = `${msg.channel.id}`;
					tableload.welcomelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_userjoinset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.welcomelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_userjoindeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'userleft') {
				if (tableload.byelog === 'false') {
					tableload.byelogchannel = `${msg.channel.id}`;
					tableload.byelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_userleftset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.byelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_userleftdeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'modlog') {
				if (tableload.modlog === 'false') {
					tableload.modlogchannel = `${msg.channel.id}`;
					tableload.modlog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_modlogset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.modlog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_modlogdeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'rolecreate') {
				if (tableload.rolecreatelog === 'false') {
					tableload.rolecreatelogchannel = `${msg.channel.id}`;
					tableload.rolecreatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_rolecreateset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.rolecreatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_rolecreatedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'roledelete') {
				if (tableload.roledeletelog === 'false') {
					tableload.roledeletelogchannel = `${msg.channel.id}`;
					tableload.roledeletelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_roledeleteset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.roledeletelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_roledeletedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'roleupdate') {
				if (tableload.roleupdatelog === 'false') {
					tableload.roleupdatelogchannel = `${msg.channel.id}`;
					tableload.roleupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_roleupdateset}**#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.roleupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_roleupdatedeleted).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'presenceupdate') {
				if (tableload.presenceupdatelog === 'false') {
					tableload.presenceupdatelogchannel = `${msg.channel.id}`;
					tableload.presenceupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(`${lang.log_presenceupdateset} **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.presenceupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					
					return msg.channel.send(lang.log_presenceupdatedeleted).then(m => m.delete(15000));
				} 
		} else if (margs[1].toLowerCase() === 'guildupdate') {
			if (tableload.guildupdatelog === 'false') {
				tableload.guildupdatelogchannel = `${msg.channel.id}`;
				tableload.guildupdatelog = 'true';
				await client.guildconfs.set(msg.guild.id, tableload);
				
				return msg.channel.send(`${lang.log_guildupdateset} **#${msg.channel.name}**`).then(m => m.delete(15000));
			} else {
				tableload.guildupdatelog = 'false';
				await client.guildconfs.set(msg.guild.id, tableload);
				
				return msg.channel.send(lang.log_guildupdatedeleted).then(m => m.delete(15000));
			}
	}
	}
	}
	msg.channel.send(`Hmm, that event doesnt exist. You can check all events that you can log with ${tableload.prefix}listevents`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'log',
	description: 'Allows you to log for different channels, different events. Use ?listevents to get a list of all events',
	usage: 'log {event}',
	example: ['log modlog'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
