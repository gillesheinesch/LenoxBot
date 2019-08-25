const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class dailyCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'daily',
      group: 'currency',
      memberName: 'daily',
      description: 'Get your daily reward or give it away to another discord user',
      format: 'daily [@User]',
      aliases: ['d'],
      examples: ['daily', 'daily @Tester#3873'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Daily',
      dashboardsettings: false,
      cooldown: 86400000
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const mentioncheck = msg.mentions.users.first();

    if (msg.client.provider.getUser(msg.author.id, 'dailyremind') === true) {
      const dailyreminder = {
        userID: msg.author.id,
        remind: Date.now() + 86400000
      };

      const currentDailyreminder = msg.client.provider.getBotsettings('botconfs', 'dailyreminder');
      currentDailyreminder[msg.author.id] = dailyreminder;
      await msg.client.provider.setBotsettings('botconfs', 'dailyreminder', currentDailyreminder);

      setTimeout(async () => {
        const currentDailyreminderTimeout = msg.client.provider.getBotsettings('botconfs', 'dailyreminder');

        delete currentDailyreminderTimeout[msg.author.id];

        await msg.client.provider.setBotsettings('botconfs', 'dailyreminder', currentDailyreminderTimeout);
        msg.author.send('Don\'t forget to pick up your daily reward!');
      }, 86400000);
    }

    if (msg.client.provider.getUser(msg.author.id, 'dailystreak').lastpick !== '') {
      if (Date.now() > msg.client.provider.getUser(msg.author.id, 'dailystreak').deadline) {
        const newDailystreakSettings = msg.client.provider.getUser(msg.author.id, 'dailystreak');
        newDailystreakSettings.streak = 0;
        newDailystreakSettings.lastpick = '';
        newDailystreakSettings.deadline = '';
        await msg.client.provider.setUser(msg.author.id, 'dailystreak', newDailystreakSettings);
      }
    }

    const newDailystreakSettings = msg.client.provider.getUser(msg.author.id, 'dailystreak');
    newDailystreakSettings.streak += 1;
    newDailystreakSettings.lastpick = Date.now();
    newDailystreakSettings.deadline = Date.now() + 172800000;
    await msg.client.provider.setUser(msg.author.id, 'dailystreak', newDailystreakSettings);

    const currentStatsDailyRecord = msg.client.provider.getUser(msg.author.id, 'stats');
    if (currentStatsDailyRecord.dailystreakhighest < newDailystreakSettings.streak) {
      currentStatsDailyRecord.dailystreakhighest = newDailystreakSettings.streak;
      await msg.client.provider.setUser(msg.author.id, 'stats', currentStatsDailyRecord);
    }


    if (!mentioncheck) {
      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      const currentDailystreak = msg.client.provider.getUser(msg.author.id, 'dailystreak');
      if (msg.client.provider.getUser(msg.author.id, 'premium').status === true || msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) {
        await msg.client.provider.setUser(msg.author.id, 'credits', (currentCredits += 400 + (currentDailystreak.streak * 2)));
      }
      else {
        await msg.client.provider.setUser(msg.author.id, 'credits', (currentCredits += 200 + (currentDailystreak.streak * 2)));
      }

      const author = lang.daily_author.replace('%amount', msg.client.provider.getUser(msg.author.id, 'premium').status === false ? 200 + (msg.client.provider.getUser(msg.author.id, 'dailystreak').streak * 2) : 400 + (msg.client.provider.getUser(msg.author.id, 'dailystreak').streak * 2));
      const streak = lang.daily_streak.replace('%streak', msg.client.provider.getUser(msg.author.id, 'dailystreak').streak);

      const remindEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setAuthor(`🎁 ${author} 🎁`)
        .setDescription(`${streak} \n\n${lang.daily_remindmsg}`);
      const noRemindEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setAuthor(`🎁 ${author} 🎁`)
        .setDescription(`${streak}`);

      const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
      currentStats.daily += 1;
      await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

      if (msg.client.provider.getUser(msg.author.id, 'dailyremind') === true) {
        return msg.channel.send({
          embed: remindEmbed
        });
      }
      return msg.channel.send({
        embed: noRemindEmbed
      });
    }

    let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
    const currentDailystreak = msg.client.provider.getUser(msg.author.id, 'dailystreak').streak;
    if (msg.client.provider.getUser(msg.author.id, 'premium').status === true || msg.client.provider.getUser(msg.author.id, 'doubleLootAndDaily')) {
      await msg.client.provider.setUser(mentioncheck.id, 'credits', (currentCredits += 400 + (currentDailystreak * 2)));
    }
    else {
      await msg.client.provider.setUser(mentioncheck.id, 'credits', (currentCredits += 200 + (currentDailystreak * 2)));
    }

    const mention = lang.daily_mention.replace('%mentiontag', mentioncheck.tag).replace('%amount', msg.client.provider.getUser(msg.author.id, 'premium').status === false ? 200 + (msg.client.provider.getUser(msg.author.id, 'dailystreak').streak * 2) : 400 + (msg.client.provider.getUser(msg.author.id, 'dailystreak').streak * 2));
    const streak = lang.daily_streak.replace('%streak', msg.client.provider.getUser(msg.author.id, 'dailystreak').streak);

    const remindEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setAuthor(`🎁 ${mention} 🎁`)
      .setDescription(`${streak} \n\n${lang.daily_remindmsg}`);
    const noRemindEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setAuthor(`🎁 ${mention} 🎁`)
      .setDescription(`${streak}`);

    const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
    currentStats.daily += 1;
    await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

    if (msg.client.provider.getUser(msg.author.id, 'dailyremind') === true) {
      return msg.channel.send({
        embed: remindEmbed
      });
    }
    return msg.channel.send({
      embed: noRemindEmbed
    });
  }
};
