const LenoxCommand = require('../LenoxCommand.js');

module.exports = class deleteeventsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'deleteevents',
      group: 'administration',
      memberName: 'deleteevents',
      description: 'Delete all active events on this server',
      format: 'deleteevents',
      aliases: [],
      examples: ['deleteevents'],
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

    if (msg.client.provider.getGuild(msg.guild.id, 'modlog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'modlog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'modlog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'messagedeletelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'messagedeletelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'messagedeletelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'messageupdatelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'messageupdatelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'messageupdatelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'channelupdatelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'channelupdatelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'channelupdatelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'channelcreatelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'channelcreatelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'channelcreatelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'channeldeletelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'channeldeletelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'channeldeletelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'guildmemberupdatelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'guildmemberupdatelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'guildmemberupdatelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'presenceupdatelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'presenceupdatelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'presenceupdatelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'welcomelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'welcomelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'welcomelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'byelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'byelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'byelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'rolecreatelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'rolecreatelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'rolecreatelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'roledeletelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'roledeletelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'roledeletelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'roleupdatelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'roleupdatelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'roleupdatelog', currentLog);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'guildupdatelog') === 'true') {
      let currentLog = msg.client.provider.getGuild(msg.guild.id, 'guildupdatelog');
      currentLog = 'false';
      await msg.client.provider.setGuild(msg.guild.id, 'guildupdatelog', currentLog);
    }

    return msg.channel.send(lang.deleteevents_eventsdisabled);
  }
};
