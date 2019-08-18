const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class toggleactivityCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'toggleactivity',
      group: 'botowner',
      memberName: 'toggleactivity',
      description: 'Shows the current bot usage',
      format: 'toggleactivity',
      aliases: [],
      examples: ['toggleactivity'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

    const channelId = msg.channel.id;

    if (msg.client.provider.getBotsettings('botconfs', 'activity') === false) {
      await msg.client.provider.setBotsettings('botconfs', 'activity', true);
      await msg.client.provider.setBotsettings('botconfs', 'activitychannel', channelId);

      const set = lang.toggleactivity_set.replace('%channelname', `#${msg.channel.name}`);
      msg.channel.send(set);
    }
    else {
      await msg.client.provider.setBotsettings('botconfs', 'activity', false);

      const unset = lang.toggleactivity_unset.replace('%channelname', `#${msg.channel.name}`);
      msg.channel.send(unset);
    }
  }
};
