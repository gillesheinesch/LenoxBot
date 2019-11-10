const LenoxCommand = require('../LenoxCommand.js');

module.exports = class dailyremindCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'dailyremind',
      group: 'currency',
      memberName: 'dailyremind',
      description: 'Enables or disables the dailyremind',
      format: 'dailyremind',
      aliases: [],
      examples: ['dailyremind'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Daily',
      dashboardsettings: false
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    if (msg.client.provider.getUser(msg.author.id, 'dailyremind') === false) {
      await msg.client.provider.setUser(msg.author.id, 'dailyremind', true);

      const set = lang.dailyremind_set.replace('%prefix', prefix);
      msg.reply(set);
    }
    else {
      await msg.client.provider.setUser(msg.author.id, 'dailyremind', false);

      const removed = lang.dailyremind_removed.replace('%prefix', prefix);
      msg.reply(removed);
    }
  }
};
