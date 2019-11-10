const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class mineCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'mine',
      group: 'currency',
      memberName: 'mine',
      description: 'With this command you can dig up minerals with your pickaxes',
      format: 'mine',
      aliases: [],
      examples: ['mine'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true,
      cooldown: 180000
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const d = Math.random();

    if (msg.client.provider.getUser(msg.author.id, 'inventory').pickaxe === 0) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.mine[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(lang.mine_nopicks);
    }

    if (d < 0.05) {
      const validationfor10procent = ['764', '983', '848'];
      const result = Math.floor(Math.random() * validationfor10procent.length);

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += parseInt(validationfor10procent[result], 10);
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

      const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentInventory.pickaxe -= 1;
      msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

      const dugup = lang.mine_dugup.replace('%amount', `**${validationfor10procent[result]}**`);
      const embed = new Discord.MessageEmbed()
        .setColor('#66ff33')
        .setDescription(dugup);

      const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
      currentStats.mine += 1;
      await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

      return msg.channel.send({ embed });
    } if (d < 0.1) {
      const validationfor30procent = ['439', '323', '356'];
      const result = Math.floor(Math.random() * validationfor30procent.length);

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += parseInt(validationfor30procent[result], 10);
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

      const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentInventory.pickaxe -= 1;
      msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

      const dugup = lang.mine_dugup.replace('%amount', `**${validationfor30procent[result]}**`);

      const embed = new Discord.MessageEmbed()
        .setColor('#66ff33')
        .setDescription(dugup);

      const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
      currentStats.mine += 1;
      await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

      return msg.channel.send({ embed });
    } if (d < 0.3) {
      const validationfor50procent = ['201', '178', '238', '199', '168', '101', '130', '135', '176'];
      const result = Math.floor(Math.random() * validationfor50procent.length);

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += parseInt(validationfor50procent[result], 10);
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

      const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
      currentInventory.pickaxe -= 1;
      msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

      const dugup = lang.mine_dugup.replace('%amount', `**${validationfor50procent[result]}**`);
      const embed = new Discord.MessageEmbed()
        .setColor('#66ff33')
        .setDescription(dugup);

      const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
      currentStats.mine += 1;
      await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

      return msg.channel.send({ embed });
    }
    const validationforrest = ['2', '98', '32', '72', '91', '85', '7', '15', '20', '28', '37'];
    const result = Math.floor(Math.random() * validationforrest.length);

    let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
    currentCredits += parseInt(validationforrest[result], 10);
    await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

    const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
    currentInventory.pickaxe -= 1;
    msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);


    const dugup = lang.mine_dugup.replace('%amount', `**${validationforrest[result]}**`);
    const embed = new Discord.MessageEmbed()
      .setColor('#66ff33')
      .setDescription(dugup);

    const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
    currentStats.mine += 1;
    await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

    return msg.channel.send({ embed });
  }
};
