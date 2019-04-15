const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class eventsCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'events',
			group: 'administration',
			memberName: 'events',
			description: 'Gives you a list of all active/disabled events',
			format: 'events',
			aliases: ['e'],
			examples: ['events'],
			category: 'administration',
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['ADMINISTRATOR'],
			shortDescription: 'Events',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');

		const commandinfo = lang.events_commandinfo.replace('%prefix', prefix);

		const embed = new Discord.RichEmbed()
			.setColor('0066CC')
			.setFooter(commandinfo)
			.setAuthor(lang.events_events);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'true') {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'modlogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Modlog ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Modlog ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'messagedellog') === 'true') {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'messagedellogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Messagedelete ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Messagedelete ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'messageupdatelog') === 'true') {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'messageupdatelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Messageupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Messageupdate ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'channelupdatelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'channelupdatelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Channelupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Channelupdate ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'channelcreatelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'channelcreatelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Channelcreate ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Channelcreate ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'channeldeletelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'channeldeletelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Channeldelete ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Channeldelete ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'guildmemberupdatelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'guildmemberupdatelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Memberupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Memberupdate ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'presenceupdatelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'presenceupdatelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Presenceupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Presenceupdate ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'welcomelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'welcomelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Userjoin ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Userjoin ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'byelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'byelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Userleft ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Userleft ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'rolecreatelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'rolecreatelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Rolecreate ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Rolecreate ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'roledeletelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'roledeletelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Roledelete ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Roledelete ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'roleupdatelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'roleupdatelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Roleupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Roleupdate ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'guildupdatelog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'guildupdatelogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Guildupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Guildupdate ${lang.events_disabled}`, `/`);
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'chatfilterlog') === `true`) {
			const channelID = msg.client.provider.getGuild(msg.message.guild.id, 'chatfilterlogchannel');
			const channelName = msg.client.channels.get(channelID).name;
			embed.addField(`✅ Chatfilter ${lang.events_active}`, `#${channelName} (${channelID})`);
		} else {
			embed.addField(`❌ Chatfilter ${lang.events_disabled}`, `/`);
		}
		msg.channel.send({ embed });
	}
};
