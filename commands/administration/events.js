const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

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

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const commandinfo = lang.events_commandinfo.replace('%prefix', prefix);

    const embed = new Discord.MessageEmbed()
      .setColor('0066CC')
      .setFooter(commandinfo)
      .setAuthor(lang.events_events);

    if (msg.client.provider.getGuild(msg.guild.id, 'modlog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'modlogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'modlogchannel');
      const channelName = msg.client.channels.get(channelID).name;

      embed.addField(`✅ Modlog ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'modlog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'modlog', 'false');
      }
      embed.addField(`❌ Modlog ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'messagedellog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'messagedellogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'messagedellogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Messagedelete ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'messagedellog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'messagedellog', 'false');
      }
      embed.addField(`❌ Messagedelete ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'messageupdatelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'messageupdatelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'messageupdatelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Messageupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'messageupdatelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'messageupdatelog', 'false');
      }
      embed.addField(`❌ Messageupdate ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'channelupdatelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'channelupdatelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'channelupdatelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Channelupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'channelupdatelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'channelupdatelog', 'false');
      }
      embed.addField(`❌ Channelupdate ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'channelcreatelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'channelcreatelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'channelcreatelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Channelcreate ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'channelcreatelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'channelcreatelog', 'false');
      }
      embed.addField(`❌ Channelcreate ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'channeldeletelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'channeldeletelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'channeldeletelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Channeldelete ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'channeldeletelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'channeldeletelog', 'false');
      }
      embed.addField(`❌ Channeldelete ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'guildmemberupdatelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'guildmemberupdatelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'guildmemberupdatelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Memberupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'guildmemberupdatelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'guildmemberupdatelog', 'false');
      }
      embed.addField(`❌ Memberupdate ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'presenceupdatelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'presenceupdatelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'presenceupdatelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Presenceupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'presenceupdatelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'presenceupdatelog', 'false');
      }
      embed.addField(`❌ Presenceupdate ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'welcomelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'welcomelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'welcomelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Userjoin ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'welcomelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'welcomelog', 'false');
      }
      embed.addField(`❌ Userjoin ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'byelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'byelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'byelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Userleft ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'byelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'byelog', 'false');
      }
      embed.addField(`❌ Userleft ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'rolecreatelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'rolecreatelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'rolecreatelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Rolecreate ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'rolecreatelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'rolecreatelog', 'false');
      }
      embed.addField(`❌ Rolecreate ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'roledeletelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'roledeletelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'roledeletelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Roledelete ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'roledeletelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'roledeletelog', 'false');
      }
      embed.addField(`❌ Roledelete ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'roleupdatelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'roleupdatelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'roleupdatelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Roleupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'roleupdatelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'roleupdatelog', 'false');
      }
      embed.addField(`❌ Roleupdate ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'guildupdatelog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'guildupdatelogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'guildupdatelogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Guildupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'guildupdatelog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'guildupdatelog', 'false');
      }
      embed.addField(`❌ Guildupdate ${lang.events_disabled}`, '/');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'chatfilterlog') === 'true' && msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'chatfilterlogchannel'))) {
      const channelID = msg.client.provider.getGuild(msg.guild.id, 'chatfilterlogchannel');
      const channelName = msg.client.channels.get(channelID).name;
      embed.addField(`✅ Chatfilter ${lang.events_active}`, `#${channelName} (${channelID})`);
    }
    else {
      if (msg.client.provider.getGuild(msg.guild.id, 'chatfilterlog') === 'true') {
        await msg.client.provider.setGuild(msg.guild.id, 'chatfilterlog', 'false');
      }
      embed.addField(`❌ Chatfilter ${lang.events_disabled}`, '/');
    }
    msg.channel.send({ embed });
  }
};
