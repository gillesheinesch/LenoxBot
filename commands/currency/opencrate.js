const LenoxCommand = require('../LenoxCommand.js');
const marketitemskeys = require('../../marketitems-keys.json');

module.exports = class opencrateCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'opencrate',
      group: 'currency',
      memberName: 'opencrate',
      description: 'With this command, you can open crates with a cratekey and win cool items!',
      format: 'opencrate',
      aliases: [],
      examples: ['opencrate'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const validationOfItems = [];
    for (const x in marketitemskeys) {
      if (Number(marketitemskeys[x][2]) < 500) { // Between 200-499
        validationOfItems.push(x);
      }
    }
    const random1 = Math.floor(Math.random() * validationOfItems.length);
    const random2 = Math.floor(Math.random() * validationOfItems.length);
    const random3 = Math.floor(Math.random() * validationOfItems.length);
    const validation = [validationOfItems[random1], validationOfItems[random2], validationOfItems[random3]];

    let inventoryslotcheck = 0;
    /* eslint guard-for-in: 0 */
    for (const index in msg.client.provider.getUser(msg.author.id, 'inventory')) {
      inventoryslotcheck += parseInt(msg.client.provider.getUser(msg.author.id, 'inventory')[index], 10);
    }
    const inventoryfull = lang.shop_inventoryfull.replace('%prefix', prefix).replace('%prefix', prefix);
    if (inventoryslotcheck >= msg.client.provider.getUser(msg.author.id, 'inventoryslots')) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.opencrate[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(inventoryfull);
    }

    if (msg.client.provider.getUser(msg.author.id, 'inventory').cratekey === 0 && msg.client.provider.getUser(msg.author.id, 'inventory').crate === 0) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.opencrate[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(lang.opencrate_nocrateandkey);
    }

    if (msg.client.provider.getUser(msg.author.id, 'inventory').cratekey === 0) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.opencrate[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(lang.opencrate_nocrate);
    }

    if (msg.client.provider.getUser(msg.author.id, 'inventory').crate === 0) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.opencrate[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(lang.opencrate_nocratekey);
    }

    for (let i = 0; i < validation.length; i += 1) {
      const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentInventory[validation[i]] += 1;
      await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);
    }

    const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
    currentInventory.cratekey -= 1;
    currentInventory.crate -= 1;
    await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

    const won = lang.opencrate_won.replace('%item1', `${msg.client.provider.getBotsettings('botconfs', 'market')[validation[0]][0]} ${lang[`loot_${validation[0]}`]}`).replace('%amount1', msg.client.provider.getBotsettings('botconfs', 'market')[validation[0]][1]).replace('%item2', `${msg.client.provider.getBotsettings('botconfs', 'market')[validation[1]][0]} ${lang[`loot_${validation[1]}`]}`)
      .replace('%amount2', msg.client.provider.getBotsettings('botconfs', 'market')[validation[1]][1])
      .replace('%item3', `${msg.client.provider.getBotsettings('botconfs', 'market')[validation[2]][0]} ${lang[`loot_${validation[2]}`]}`)
      .replace('%amount3', msg.client.provider.getBotsettings('botconfs', 'market')[validation[2]][1]);
    msg.reply(`📁 ${won}`);

    const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
    currentStats.openedcrates += 1;
    await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);
  }
};
