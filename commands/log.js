exports.run = (client, msg, args) => {
	const validation = ['messagedelete', 'messageupdate', 'guildupdate', 'channelupdate', 'channelcreate', 'channeldelete', 'welcomemessage', 'byemessage', 'modlog'];
	const tableload = client.guildconfs.get(msg.guild.id);
	const margs = msg.content.split(' ');
	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'messagedelete') {
				if (tableload.messagedellog === 'false') {
					tableload.messagedellogchannel = `${msg.channel.id}`;
					tableload.messagedellog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All deleted messages are now logged in Channel **#${msg.channel.name}**`);
				} else {
					tableload.messagedellog = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All deleted messages will no longer be logged!`);
				}
			} else if (margs[1].toLowerCase() === 'messageupdate') {
				if (tableload.messageupdatelog === 'false') {
					tableload.messageupdatelogchannel = `${msg.channel.id}`;
					tableload.messageupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All updated messages are now logged in Channel **#${msg.channel.name}**`);
				} else {
					tableload.messageupdatelog = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All updated messages will no longer be logged!`);
				}
			} else if (margs[1].toLowerCase() === 'guildupdate') {
				if (tableload.guildupdatelog === 'false') {
					tableload.guildupdatelogchannel = `${msg.channel.id}`;
					tableload.guildupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All guild updates are now logged in Channel **#${msg.channel.name}**`);
				} else {
					tableload.guildupdatelog = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All guild updates will no longer be logged!`);
				}
			} else if (margs[1].toLowerCase() === 'channelupdate') {
				if (tableload.channelupdatelog === 'false') {
					tableload.channelupdatelogchannel = `${msg.channel.id}`;
					tableload.channelupdatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All channel updates are now logged in Channel **#${msg.channel.name}**`);
				} else {
					tableload.channelupdatelog = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All channel updates will no longer be logged!`);
				}
			} else if (margs[1].toLowerCase() === 'channelcreate') {
				if (tableload.channelcreatelog === 'false') {
					tableload.channelcreatelogchannel = `${msg.channel.id}`;
					tableload.channelcreatelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All newly created channel are now logged in Channel **#${msg.channel.name}**`);
				} else {
					tableload.channelcreatelog = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All newly created channel will no longer be logged!`);
				}
			} else if (margs[1].toLowerCase() === 'channeldelete') {
				if (tableload.channeldeletelog === 'false') {
					tableload.channeldeletelogchannel = `${msg.channel.id}`;
					tableload.channeldeletelog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All newly deleted channel are now logged in Channel **#${msg.channel.name}**`);
				} else {
					tableload.channeldeletelog = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All newly deleted channel will no longer be logged!`);
				}
			} else if (margs[1].toLowerCase() === 'welcomemessage') {
				if (tableload.welcome === 'false') {
					tableload.welcomebyechannel = `${msg.channel.id}`;
					tableload.welcome = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`Every user who joins the server will now be logged in channel **#${msg.channel.name}**`);
				} else {
					tableload.welcome = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`Every user who joins the server will no longer be logged!`);
				}
			} else if (margs[1].toLowerCase() === 'byemessage') {
				if (tableload.bye === 'false') {
					tableload.welcomebyechannel = `${msg.channel.id}`;
					tableload.bye = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`Every user who leaves the server will now be logged here in channel **#${msg.channel.name}**`);
				} else {
					tableload.bye = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`Every user who leaves the server will no longer be logged!`);
				}
			} else if (margs[1].toLowerCase() === 'modlog') {
				if (tableload.modlog === 'false') {
					tableload.modlogchannel = `${msg.channel.id}`;
					tableload.modlog = 'true';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All moderative actions are now logged in Channel **#${msg.channel.name}**`);
				} else {
					tableload.modlog = 'false';
					client.guildconfs.set(msg.guild.id, tableload);
					return msg.channel.send(`All moderative actions will no longer be logged!`);
				}
			}
		}
	}
	msg.channel.send(`Hmm, that event doesnt exist. You can check all events that you can log with ${tableload.prefix}listevents`);
};
