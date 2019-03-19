const LenoxCommand = require('../LenoxCommand.js');

module.exports = class logCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'log',
			group: 'administration',
			memberName: 'log',
			description: 'Allows you to log for different channels, different events. Use ?listevents to get a list of all events',
			format: 'log {name of the event}',
			aliases: [],
			examples: ['log modlog'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['ADMINISTRATOR'],
			shortDescription: 'Events',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');
		const args = msg.content.split(' ').slice(1);

		const validation = ['chatfilter', 'modlog', 'messagedelete', 'messageupdate', 'channelupdate', 'channelcreate', 'channeldelete', 'memberupdate', 'presenceupdate', 'userjoin', 'userleft', 'rolecreate', 'roledelete', 'roleupdate', 'guildupdate'];
		const content = args.slice().join(' ');
		const margs = msg.content.split(' ');

		const noinput = lang.log_noinput.replace('%prefix', prefix);
		if (!content) return msg.channel.send(noinput);

		for (let i = 0; i < margs.length; i++) {
			if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
				if (margs[1].toLowerCase() === 'messagedelete') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'messagedellog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'messagedellogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'messagedellog', 'true');

						const messagedeleteset = lang.log_messagedeleteset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(messagedeleteset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'messagedellog', 'false');

					return msg.channel.send(lang.log_messagedeletedeleted);
				} else if (margs[1].toLowerCase() === 'messageupdate') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'messageupdatelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'messageupdatelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'messageupdatelog', 'true');

						const messageupdateset = lang.log_messageupdateset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(messageupdateset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'messageupdatelog', 'false');

					return msg.channel.send(lang.log_messageupdatedeleted);
				} else if (margs[1].toLowerCase() === 'channelupdate') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'channelupdatelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'channelupdatelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'channelupdatelog', 'true');

						const channelupdateset = lang.log_channelupdateset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(channelupdateset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'channelupdatelog', 'false');

					return msg.channel.send(lang.log_channelupdatedeleted);
				} else if (margs[1].toLowerCase() === 'memberupdate') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'guildmemberupdatelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'guildmemberupdatelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'guildmemberupdatelog', 'true');

						const memberupdateset = lang.log_memberupdateset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(memberupdateset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'guildmemberupdatelog', 'false');

					return msg.channel.send(lang.log_memberupdatedeleted);
				} else if (margs[1].toLowerCase() === 'channelcreate') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'channelcreatelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'channelcreatelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'channelcreatelog', 'true');

						const channelcreateset = lang.log_channelcreateset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(channelcreateset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'channelcreatelog', 'false');

					return msg.channel.send(lang.log_channelcreatedeleted);
				} else if (margs[1].toLowerCase() === 'channeldelete') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'channeldeletelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'channeldeletelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'channeldeletelog', 'true');

						const channeldeleteset = lang.log_channeldeleteset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(channeldeleteset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'channeldeletelog', 'false');

					return msg.channel.send(lang.log_channeldeletedeleted);
				} else if (margs[1].toLowerCase() === 'userjoin') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'welcomelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'welcomelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'welcomelog', 'true');

						const userjoinset = lang.log_userjoinset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(userjoinset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'welcomelog', 'false');

					return msg.channel.send(lang.log_userjoindeleted);
				} else if (margs[1].toLowerCase() === 'userleft') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'byelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'byelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'byelog', 'true');

						const userleftset = lang.log_userleftset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(userleftset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'byelog', 'false');

					return msg.channel.send(lang.log_userleftdeleted);
				} else if (margs[1].toLowerCase() === 'modlog') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'modlogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'modlog', 'true');

						const modlogset = lang.log_modlogset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(modlogset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'modlog', 'false');

					return msg.channel.send(lang.log_modlogdeleted);
				} else if (margs[1].toLowerCase() === 'rolecreate') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'rolecreatelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'rolecreatelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'rolecreatelog', 'true');

						const rolecreateset = lang.log_rolecreateset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(rolecreateset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'rolecreatelog', 'false');

					return msg.channel.send(lang.log_rolecreatedeleted);
				} else if (margs[1].toLowerCase() === 'roledelete') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'roledeletelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'roledeletelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'roledeletelog', 'true');

						const roledeleteset = lang.log_roledeleteset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(roledeleteset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'roledeletelog', 'false');

					return msg.channel.send(lang.log_roledeletedeleted);
				} else if (margs[1].toLowerCase() === 'roleupdate') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'roleupdatelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'roleupdatelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'roleupdatelog', 'true');

						const roleupdateset = lang.log_roleupdateset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(roleupdateset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'roleupdatelog', 'false');

					return msg.channel.send(lang.log_roleupdatedeleted);
				} else if (margs[1].toLowerCase() === 'presenceupdate') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'presenceupdatelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'presenceupdatelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'presenceupdatelog', 'true');

						const presenceupdateset = lang.log_presenceupdateset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(presenceupdateset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'presenceupdatelog', 'false');

					return msg.channel.send(lang.log_presenceupdatedeleted);
				} else if (margs[1].toLowerCase() === 'guildupdate') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'guildupdatelog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'guildupdatelogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'guildupdatelog', 'true');

						const guildupdateset = lang.log_guildupdateset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(guildupdateset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'guildupdatelog', 'false');

					return msg.channel.send(lang.log_guildupdatedeleted);
				} else if (margs[1].toLowerCase() === 'chatfilter') {
					if (msg.client.provider.getGuild(msg.message.guild.id, 'chatfilterlog') === 'false') {
						await msg.client.provider.setGuild(msg.message.guild.id, 'chatfilterlogchannel', msg.channel.id);
						await msg.client.provider.setGuild(msg.message.guild.id, 'chatfilterlog', 'true');

						const chatfilterset = lang.log_chatfilterset.replace('%channelname', `**#${msg.channel.name}**`);
						return msg.channel.send(chatfilterset);
					}
					await msg.client.provider.setGuild(msg.message.guild.id, 'chatfilterlog', 'false');

					return msg.channel.send(lang.log_chatfilterdeleted);
				}
			}
		}
		const error = lang.log_error.replace('%prefix', prefix);
		msg.channel.send(error);
	}
};
