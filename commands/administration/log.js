exports.run = async(client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));
	
	const validation = ['modlog', 'messagedelete', 'messageupdate', 'channelupdate', 'channelcreate', 'channeldelete', 'memberupdate', 'presenceupdate', 'userjoin', 'userleft', 'rolecreate', 'roledelete', 'roleupdate', 'guildupdate'];
	const tableload = client.guildconfs.get(msg.guild.id);
	const content = args.slice().join(" ");
	const margs = msg.content.split(' ');

	if (!content) return msg.channel.send(`You forgot to enter what event you want to have logged in the channel. You can get a list of all available events with ${tableload.prefix}listevents`);

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'messagedelete') {
				if (tableload.messagedellog === 'false') {
					tableload.messagedellogchannel = `${msg.channel.id}`;
					tableload.messagedellog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All deleted messages are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.messagedellog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All deleted messages will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'messageupdate') {
				if (tableload.messageupdatelog === 'false') {
					tableload.messageupdatelogchannel = `${msg.channel.id}`;
					tableload.messageupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All updated messages are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.messageupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All updated messages will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'channelupdate') {
				if (tableload.channelupdatelog === 'false') {
					tableload.channelupdatelogchannel = `${msg.channel.id}`;
					tableload.channelupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All channel updates are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.channelupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All channel updates will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'memberupdate') {
				if (tableload.guildmemberupdatelog === 'false') {
					tableload.guildmemberupdatelogchannel = `${msg.channel.id}`;
					tableload.guildmemberupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All member updates are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.guildmemberupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All member updates will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'channelcreate') {
				if (tableload.channelcreatelog === 'false') {
					tableload.channelcreatelogchannel = `${msg.channel.id}`;
					tableload.channelcreatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All newly created channel are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.channelcreatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All newly created channel will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'channeldelete') {
				if (tableload.channeldeletelog === 'false') {
					tableload.channeldeletelogchannel = `${msg.channel.id}`;
					tableload.channeldeletelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All newly deleted channel are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.channeldeletelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All newly deleted channel will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'userjoin') {
				if (tableload.welcomelog === 'false') {
					tableload.welcomelogchannel = `${msg.channel.id}`;
					tableload.welcomelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`Every user who joins the server will now be logged in channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.welcomelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`Every user who joins the server will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'userleft') {
				if (tableload.byelog === 'false') {
					tableload.byelogchannel = `${msg.channel.id}`;
					tableload.byelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`Every user who leaves the server will now be logged here in channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.byelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`Every user who leaves the server will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'modlog') {
				if (tableload.modlog === 'false') {
					tableload.modlogchannel = `${msg.channel.id}`;
					tableload.modlog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All moderative actions are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.modlog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All moderative actions will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'rolecreate') {
				if (tableload.rolecreatelog === 'false') {
					tableload.rolecreatelogchannel = `${msg.channel.id}`;
					tableload.rolecreatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All newly created roles are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.rolecreatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All newly created roles will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'roledelete') {
				if (tableload.roledeletelog === 'false') {
					tableload.roledeletelogchannel = `${msg.channel.id}`;
					tableload.roledeletelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All newly deleted roles are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.roledeletelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All newly deleted roles will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'roleupdate') {
				if (tableload.roleupdatelog === 'false') {
					tableload.roleupdatelogchannel = `${msg.channel.id}`;
					tableload.roleupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All role updates are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.roleupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All role updates will no longer be logged!`).then(m => m.delete(15000));
				}
			} else if (margs[1].toLowerCase() === 'presenceupdate') {
				if (tableload.presenceupdatelog === 'false') {
					tableload.presenceupdatelogchannel = `${msg.channel.id}`;
					tableload.presenceupdatelog = 'true';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All member presence changes are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
				} else {
					tableload.presenceupdatelog = 'false';
					await client.guildconfs.set(msg.guild.id, tableload);
					await client.guildconfs.close();
					return msg.channel.send(`All member presence changes will no longer be logged!`).then(m => m.delete(15000));
				} 
		} else if (margs[1].toLowerCase() === 'guildupdate') {
			if (tableload.guildupdatelog === 'false') {
				tableload.guildupdatelogchannel = `${msg.channel.id}`;
				tableload.guildupdatelog = 'true';
				await client.guildconfs.set(msg.guild.id, tableload);
				await client.guildconfs.close();
				return msg.channel.send(`All guild updates are now logged in Channel **#${msg.channel.name}**`).then(m => m.delete(15000));
			} else {
				tableload.guildupdatelog = 'false';
				await client.guildconfs.set(msg.guild.id, tableload);
				await client.guildconfs.close();
				return msg.channel.send(`All guild updates will no longer be logged!`).then(m => m.delete(15000));
			}
	}
	}
	}
	msg.channel.send(`Hmm, that event doesnt exist. You can check all events that you can log with ${tableload.prefix}listevents`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'log',
	description: 'With this command you can log for different channels, different events. Use ?listevents to get a list of all events',
	usage: 'log {event}',
	example: 'log modlog',
	category: 'administration'
};
