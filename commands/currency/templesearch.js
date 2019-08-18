const LenoxCommand = require('../LenoxCommand.js');

module.exports = class templesearchCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'templesearch',
      group: 'currency',
      memberName: 'templesearch',
      description: 'Search for something valuable in the long-abandoned temple in the Sahara',
      format: 'templesearch',
      aliases: [],
      examples: ['templesearch'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const random = Math.random();

    if (msg.client.provider.getUser(msg.author.id, 'inventory').flashlight === 0) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.templesearch[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(lang.templesearch_error);
    }

    if (random < 0.5) {
      const result = Math.floor(Math.random() * 500) + 1;

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += result;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

      const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentInventory.flashlight -= 1;
      await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

      const received = lang.templesearch_received.replace('%amount', `\`$${result}\``);

      const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
      currentStats.templesearch += 1;
      await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

      return msg.reply(received);
    }
    const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
    currentInventory.flashlight -= 1;
    await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

    const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
    currentStats.templesearch += 1;
    await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

    return msg.reply(lang.templesearch_dust);
  }
};
