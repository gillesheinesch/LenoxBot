const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class useserverkeyCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'useserverkey',
      group: 'utility',
      memberName: 'useserverkey',
      description: 'Displays the points of you or a user',
      format: 'useserverkey {key}',
      aliases: [],
      examples: ['useserverkey 1122'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Premium',
      dashboardsettings: true,
      cooldown: 43200000
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const input = args.slice();

    const wrongusage = lang.useserverkey_wrongusage.replace('%prefix', msg.client.provider.getGuild(msg.guild.id, 'prefix'));
    if (msg.mentions.users.first()) return msg.reply(wrongusage);
    if (!input || input.length === 0) return msg.reply(lang.useserverkey_noinput);
    if (!msg.client.provider.getBotsettings('botconfs', 'premium').keys.guildkeys.includes(input.join(' '))) return msg.reply(lang.useserverkey_notexist);
    if (msg.client.provider.getBotsettings('botconfs', 'premium').keys.redeemedguildkeys.includes(input.join(' '))) return msg.reply(lang.useserverkey_already);

    if (msg.client.provider.getGuild(msg.guild.id, 'premium').status === false) {
      const currentPremium = msg.client.provider.getGuild(msg.guild.id, 'premium');
      currentPremium.status = true;
      currentPremium.bought.push(new Date().getTime);
      const now = new Date().getTime();
      currentPremium.end = new Date(now + 2592000000);
      await msg.client.provider.setGuild(msg.guild.id, 'premium', currentPremium);

      const newCurrentPremium = msg.client.provider.getBotsettings('botconfs', 'premium');
      newCurrentPremium.keys.redeemedguildkeys.push(input.join(' '));
      await msg.client.provider.setBotsettings('botconfs', 'premium', newCurrentPremium);

      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.useserverkey[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);

      const embed = new Discord.MessageEmbed()
        .setDescription(`This discord server used a premium serverkey (Code: ${input.join(' ')})! \n\nThis discord server has premium until ${msg.client.provider.getGuild(msg.guild.id, 'premium').end.toUTCString()}`)
        .setAuthor(`Serverkey used by ${msg.author.tag} for ${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL())
        .setTimestamp()
        .setColor('#ff0000')
        .setTitle('New Serverkey used!');
      await msg.client.channels.get(settings.keychannel).send({ embed });
      const redeemed = lang.useserverkey_redeemed.replace('%date', `\`${msg.client.provider.getGuild(msg.guild.id, 'premium').end.toUTCString()}\``);
      return msg.reply(redeemed);
    }
    const currentPremium = msg.client.provider.getGuild(msg.guild.id, 'premium');
    currentPremium.bought.push(new Date().getTime);
    currentPremium.end = new Date(Date.parse(msg.client.provider.getGuild(msg.guild.id, 'premium').end) + 2592000000);
    await msg.client.provider.setGuild(msg.guild.id, 'premium', currentPremium);

    const newCurrentPremium = msg.client.provider.getBotsettings('botconfs', 'premium');
    newCurrentPremium.keys.redeemedguildkeys.push(input.join(' '));
    await msg.client.provider.setBotsettings('botconfs', 'premium', newCurrentPremium);

    const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
    delete timestamps.useserverkey[msg.author.id];
    await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);

    const embed = new Discord.MessageEmbed()
      .setDescription(`This discord server used a premium serverkey (Code: ${input.join(' ')})! \n\nThis discord server has premium until ${new Date(Date.parse(msg.client.provider.getGuild(msg.guild.id, 'premium').end) + 2592000000).toUTCString()}`)
      .setAuthor(`Serverkey used by ${msg.author.tag} for ${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL())
      .setTimestamp()
      .setColor('#ff0000')
      .setTitle('New Serverkey used!');
    await msg.client.channels.get(settings.keychannel).send({ embed });

    const extended = lang.useserverkey_extended.replace('%date', `\`${new Date(Date.parse(msg.client.provider.getGuild(msg.guild.id, 'premium').end) + 2592000000).toUTCString()}\``);
    return msg.reply(extended);
  }
};
