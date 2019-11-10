const Discord = require('discord.js');
const ms = require('ms');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class remindCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'remind',
      group: 'utility',
      memberName: 'remind',
      description: 'Sets a reminder',
      format: 'remind <add/remove/list> <time in d, h, m, s> <text>',
      aliases: [],
      examples: ['remind add 1d Give the dog his food', 'remind remove Give the dog his food', 'remind list'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');
    const args = msg.content.split(' ').slice(1);

    const currentReminder = msg.client.provider.getUser(msg.author.id, 'currentReminder');

    const validation = ['add', 'remove', 'list', lang.remind_parameter_add, lang.remind_parameter_remove, lang.remind_parameter_list];
    const margs = msg.content.split(' ');

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'add' || margs[1].toLowerCase() === lang.remind_parameter_add.toLowerCase()) {
          if (currentReminder.length === 5 && msg.client.provider.getUser(msg.author.id, 'premium').status === false) return msg.reply(lang.remind_maxreachednopremium);
          if (currentReminder.length === 25) return msg.reply(lang.remind_maxwithpremium);

          const remindTime = args.slice(1, 2).join(' ');
          if (!remindTime) return msg.channel.send(lang.remind_notime);
          const msTime = ms(remindTime);

          const remind_invalidtime = lang.remind_invalidtime.replace('%prefix', prefix);
          if (typeof msTime === 'undefined') return msg.channel.send(remind_invalidtime);

          const remindText = args.slice(2).join(' ');
          if (!remindText) return msg.reply(lang.remind_notext);
          if (remindText.length > 300) return msg.reply(lang.remind_textmax);

          let currentReminderCount = msg.client.provider.getBotsettings('botconfs', 'reminderCount');
          currentReminderCount += 1;
          await msg.client.provider.setBotsettings('botconfs', 'reminderCount', currentReminderCount);

          currentReminder.push(currentReminderCount);
          await msg.client.provider.setUser(msg.author.id, 'currentReminder', currentReminder);

          const remindSettings = {
            id: currentReminderCount,
            userId: msg.author.id,
            channelId: msg.channel.id,
            guildId: msg.guild.id,
            time: msTime,
            remindCreatedAt: Date.now(),
            remindEndDate: Date.now() + msTime,
            text: remindText
          };

          const currentReminders = msg.client.provider.getBotsettings('botconfs', 'reminder');
          currentReminders[currentReminderCount] = remindSettings;
          await msg.client.provider.setBotsettings('botconfs', 'reminder', currentReminders);

          const sentEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTimestamp()
            .setTitle(lang.remind_addembedtitle)
            .setDescription(`${lang.remind_addembedduration}: ${remindTime} \n${lang.remind_addembedtext}: ${remindText}`);

          msg.reply({ embed: sentEmbed });

          setTimeout(async () => {
            const currentReminder2 = msg.client.provider.getUser(msg.author.id, 'currentReminder');
            const indexOfRemind = currentReminder2.indexOf(currentReminderCount);
            currentReminder2.splice(indexOfRemind, 1);
            await msg.client.provider.setUser(msg.author.id, 'currentReminder', currentReminder2);

            const currentReminders2 = msg.client.provider.getBotsettings('botconfs', 'reminder');
            delete currentReminders2[currentReminderCount];
            await msg.client.provider.setBotsettings('botconfs', 'reminder', currentReminders2);

            const remindPassedEmbed = new Discord.MessageEmbed()
              .setColor('BLUE')
              .setTimestamp()
              .setTitle(lang.remind_embedremindpassed)
              .setDescription(`${lang.remind_addembedtext}: ${remindText}`);

            msg.reply({ embed: remindPassedEmbed });
          }, msTime);
          return undefined;
        } if (margs[1].toLowerCase() === 'remove' || margs[1].toLowerCase() === lang.remind_parameter_remove.toLowerCase()) {
          const reminderText = args.slice(1).join(' ');
          if (!reminderText) return msg.reply(lang.remind_notextfordelete);

          const currentBotReminder = msg.client.provider.getBotsettings('botconfs', 'reminder');

          for (let i = 0; i < currentReminder.length; i += 1) {
            if (currentBotReminder[currentReminder[i]].text.toLowerCase() === reminderText.toLowerCase()) {
              const currentReminders2 = msg.client.provider.getBotsettings('botconfs', 'reminder');
              delete currentReminders2[currentReminder[i].id];
              await msg.client.provider.setBotsettings('botconfs', 'reminder', currentReminders2);

              const currentReminder2 = msg.client.provider.getUser(msg.author.id, 'currentReminder');
              const indexOfRemind = currentReminder2.indexOf(currentReminder[i].id);
              currentReminder2.splice(indexOfRemind, 1);
              await msg.client.provider.setUser(msg.author.id, 'currentReminder', currentReminder2);

              return msg.reply(lang.remind_reminderdeleted);
            }
          }
          return msg.reply(lang.remind_remindnoexist);
        } if (margs[1].toLowerCase() === 'list' || margs[1].toLowerCase() === lang.remind_parameter_list.toLowerCase()) {
          if (currentReminder.length === 0) return msg.reply(lang.remind_noreminder);

          const reminderEmbed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTimestamp();

          const arrayOfReminder = [];
          const currentReminders = msg.client.provider.getBotsettings('botconfs', 'reminder');
          for (let i = 0; i < currentReminder.length; i += 1) {
            arrayOfReminder.push(currentReminders[currentReminder[i]]);
          }

          for (let index = 0; index < arrayOfReminder.slice(0, 5).length; index += 1) {
            reminderEmbed.addField(`${lang.remind_embedreminder} \`${arrayOfReminder[index].text}\``, `${lang.remind_duration} ${ms(arrayOfReminder[index].remindEndDate - Date.now())}`);
          }

          const message = await msg.reply({ embed: reminderEmbed });

          if (currentReminder.length <= 5) return undefined;
          const reaction1 = await message.react('◀');
          const reaction2 = await message.react('▶');

          let firsttext = 0;
          let secondtext = 5;

          const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
          collector.on('collect', (r) => {
            const reactionadd = arrayOfReminder.slice(firsttext + 5, secondtext + 5).length;
            const reactionremove = arrayOfReminder.slice(firsttext - 5, secondtext - 5).length;

            if (r.emoji.name === '▶' && reactionadd !== 0) {
              r.users.remove(msg.author.id);
              const reminder = arrayOfReminder.slice(firsttext + 5, secondtext + 5);

              firsttext += 5;
              secondtext += 5;

              const newReminderEmbed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTimestamp();

              for (let index = 0; index < reminder.slice(firsttext, secondtext).length; index += 1) {
                reminderEmbed.addField(`${lang.remind_embedreminder} \`${reminder[index].text}\``, `${lang.remind_duration} ${ms(reminder[index].remindEndDate - Date.now())}`);
              }

              message.edit({ embed: newReminderEmbed });
            }
            else if (r.emoji.name === '◀' && reactionremove !== 0) {
              r.users.remove(msg.author.id);
              const reminder = arrayOfReminder.slice(firsttext - 5, secondtext - 5);

              firsttext -= 5;
              secondtext -= 5;

              const newReminderEmbed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTimestamp();

              for (let index = 0; index < reminder.slice(firsttext, secondtext).length; index += 1) {
                reminderEmbed.addField(`${lang.remind_embedreminder} \`${reminder[index].text}\``, `${lang.remind_duration} ${ms(reminder[index].remindEndDate - Date.now())}`);
              }

              message.edit({ embed: newReminderEmbed });
            }
          });
          collector.on('end', () => {
            reaction1.users.remove();
            reaction2.users.remove();
          });
        }
      }
    }
    const remind_invalid = lang.remind_invalid.replace('%prefix', prefix);
    return msg.reply(remind_invalid);
  }
};
