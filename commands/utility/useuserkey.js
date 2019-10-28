const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class useuserkeyCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'useuserkey',
      group: 'utility',
      memberName: 'useuserkey',
      description: 'With this command you can use a premium userkey',
      format: 'useuserkey {key}',
      aliases: [],
      examples: ['useuserkey 1122'],
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

    const wrongusage = lang.useuserkey_wrongusage.replace('%prefix', msg.client.provider.getGuild(msg.guild.id, 'prefix'));
    if (msg.mentions.users.first()) return msg.reply(wrongusage);
    if (!input || input.length === 0) return msg.reply(lang.useuserkey_noinput);
    if (!msg.client.provider.getBotsettings('botconfs', 'premium').keys.userkeys.includes(input.join(' '))) return msg.reply(lang.useuserkey_notexist);
    if (msg.client.provider.getBotsettings('botconfs', 'premium').keys.redeemeduserkeys.includes(input.join(' '))) return msg.reply(lang.useuserkey_already);

    if (msg.client.provider.getUser(msg.author.id, 'premium').status === false) {
      const currentPremium = msg.client.provider.getUser(msg.author.id, 'premium');
      currentPremium.status = true;
      currentPremium.bought.push(new Date().getTime);
      const now = new Date().getTime();
      currentPremium.end = new Date(now + 2592000000);
      await msg.client.provider.setUser(msg.author.id, 'premium', currentPremium);

      const newCurrentPremium = msg.client.provider.getBotsettings('botconfs', 'premium');
      newCurrentPremium.keys.redeemeduserkeys.push(input.join(' '));
      await msg.client.provider.setBotsettings('botconfs', 'premium', newCurrentPremium);

      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.useuserkey[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += 5000;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

      const embed = new Discord.MessageEmbed()
        .setDescription(`This user used a premium userkey (Code: ${input.join(' ')})! \n\nThis user has premium until ${msg.client.provider.getUser(msg.author.id, 'premium').end.toUTCString()}`)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setTimestamp()
        .setColor('#66ff33')
        .setTitle('New Userkey used!');
      await msg.client.channels.get(settings.keychannel).send({ embed });

      const redeemed = lang.useuserkey_redeemed.replace('%date', `\`${msg.client.provider.getUser(msg.author.id, 'premium').end.toUTCString()}\``);
      return msg.reply(redeemed);
    }
    const currentPremium = msg.client.provider.getUser(msg.author.id, 'premium');
    currentPremium.bought.push(new Date().getTime);
    currentPremium.end = new Date(Date.parse(msg.client.provider.getUser(msg.author.id, 'premium').end) + 2592000000);
    await msg.client.provider.setUser(msg.author.id, 'premium', currentPremium);

    const newCurrentPremium = msg.client.provider.getBotsettings('botconfs', 'premium');
    newCurrentPremium.keys.redeemeduserkeys.push(input.join(' '));
    await msg.client.provider.setBotsettings('botconfs', 'premium', newCurrentPremium);

    const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
    delete timestamps.useuserkey[msg.author.id];
    await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);

    let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
    currentCredits += 5000;
    await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

    const embed = new Discord.MessageEmbed()
      .setDescription(`This user used a premium userkey (Code: ${input.join(' ')})! \n\nThis user has premium until ${new Date(Date.parse(msg.client.provider.getUser(msg.author.id, 'premium').end + 2592000000)).toUTCString()}`)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setTimestamp()
      .setColor('#66ff33')
      .setTitle('Userkey used!');
    await msg.client.channels.get(settings.keychannel).send({ embed });

    const extended = lang.useuserkey_extended.replace('%date', `\`${new Date(Date.parse(msg.client.provider.getUser(msg.author.id, 'premium').end) + 2592000000).toUTCString()}\``);
    return msg.reply(extended);
  }
};
