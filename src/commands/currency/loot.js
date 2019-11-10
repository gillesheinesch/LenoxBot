const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const marketitemskeys = require('../../marketitems-keys.json');

module.exports = class lootCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'loot',
      group: 'currency',
      memberName: 'loot',
      description: 'Take your loot every 10 minutes',
      format: 'loot',
      aliases: ['l'],
      examples: ['loot'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: false,
      cooldown: 600000
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const d = Math.random();
    const marketconfs = msg.client.provider.getBotsettings('botconfs', 'market');

    const validationfor10percent = [];
    const validationfor30percent = [];
    const validationfor50percent = [];
    const validationforrest = [];
    for (const x in marketitemskeys) {
      if (Number(marketitemskeys[x][2]) >= 1000) { // Between 1000-unlimited
        validationfor10percent.push(x);
      }
      if (Number(marketitemskeys[x][2]) >= 500 && Number(marketitemskeys[x][2]) < 1000) { // Between 500-999
        validationfor30percent.push(x);
      }
      if (Number(marketitemskeys[x][2]) >= 100 && Number(marketitemskeys[x][2]) < 500) { // Between 200-499
        validationfor50percent.push(x);
      }
      if (Number(marketitemskeys[x][2]) < 100) { // Between 0-199
        validationforrest.push(x);
      }
    }

    let inventoryslotcheck = 0;
    /* eslint guard-for-in: 0 */
    for (const index in msg.client.provider.getUser(msg.author.id, 'inventory')) {
      inventoryslotcheck += parseInt(msg.client.provider.getUser(msg.author.id, 'inventory')[index], 10);
    }
    const inventoryfull = lang.shop_inventoryfull.replace('%prefix', prefix).replace('%prefix', prefix);
    if (inventoryslotcheck >= msg.client.provider.getUser(msg.author.id, 'inventoryslots') && !msg.client.provider.getUser(msg.author.id, 'premium').status) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.loot[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(inventoryfull);
    } if (inventoryslotcheck + 1 >= msg.client.provider.getUser(msg.author.id, 'inventoryslots') && msg.client.provider.getUser(msg.author.id, 'premium').status) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.loot[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(inventoryfull);
    }


    const creditsloot = (!msg.client.provider.getUser(msg.author.id, 'premium').status && !msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? Math.floor(Math.random() * 70) + 1 : (Math.floor(Math.random() * 70) + 1) * 2;

    if (d < 0.001) {
      const result = Math.floor(Math.random() * validationfor10percent.length);

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += creditsloot;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);
      const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentItems[validationfor10percent[result]] += (msg.client.provider.getUser(msg.author.id, 'premium').status || msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? 2 : 1;
      await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);

      const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor10percent[result]][0]} ${lang[`loot_${validationfor10percent[result]}`]} ($${marketconfs[validationfor10percent[result]][2]})`).replace('%howmany', (!msg.client.provider.getUser(msg.author.id, 'premium').status && !msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? '1' : '2');
      const embed = new Discord.MessageEmbed()
        .setColor('#66ff33')
        .setDescription(`🎉 ${lootmessage}`);
      msg.channel.send({
        embed
      });
    }
    else if (d < 0.05) {
      const result = Math.floor(Math.random() * validationfor30percent.length);

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += creditsloot;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);
      const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentItems[validationfor30percent[result]] += (msg.client.provider.getUser(msg.author.id, 'premium').status || msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? 2 : 1;
      await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);

      const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor30percent[result]][0]} ${lang[`loot_${validationfor30percent[result]}`]} ($${marketconfs[validationfor30percent[result]][2]})`).replace('%howmany', (!msg.client.provider.getUser(msg.author.id, 'premium').status && !msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? '1' : '2');

      const embed = new Discord.MessageEmbed()
        .setColor('#66ff33')
        .setDescription(`🎉 ${lootmessage}`);
      msg.channel.send({
        embed
      });
    }
    else if (d < 0.2) {
      const result = Math.floor(Math.random() * validationfor50percent.length);

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += creditsloot;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);
      const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentItems[validationfor50percent[result]] += (msg.client.provider.getUser(msg.author.id, 'premium').status || msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? 2 : 1;
      await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);

      const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor50percent[result]][0]} ${lang[`loot_${validationfor50percent[result]}`]} ($${marketconfs[validationfor50percent[result]][2]})`).replace('%howmany', (!msg.client.provider.getUser(msg.author.id, 'premium').status && !msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? '1' : '2');

      const embed = new Discord.MessageEmbed()
        .setColor('#66ff33')
        .setDescription(`🎉 ${lootmessage}`);
      msg.channel.send({
        embed
      });
    }
    else {
      const result = Math.floor(Math.random() * validationforrest.length);

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += creditsloot;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);
      const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentItems[validationforrest[result]] += (msg.client.provider.getUser(msg.author.id, 'premium').status || msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? 2 : 1;
      await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);

      const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationforrest[result]][0]} ${lang[`loot_${validationforrest[result]}`]} ($${marketconfs[validationforrest[result]][2]})`).replace('%howmany', (!msg.client.provider.getUser(msg.author.id, 'premium').status && !msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) ? '1' : '2');

      const embed = new Discord.MessageEmbed()
        .setColor('#66ff33')
        .setDescription(`🎉 ${lootmessage}`);
      msg.channel.send({
        embed
      });
    }
    const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
    currentStats.loot += 1;
    await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);
  }
};
