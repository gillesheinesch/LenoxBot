const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const ms = require('ms');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class punishmentsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'punishments',
      group: 'moderation',
      memberName: 'punishments',
      description: 'Shows you the punishments from a user',
      format: 'punishments {show/delete} {@User/UserID} [ID of the report]',
      aliases: ['p'],
      examples: ['punishments show @Monkeyyy11#7584', 'punishments delete @Monkeyyy11#7584 1'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['KICK_MEMBERS'],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    moment.locale(msg.client.provider.getGuild(msg.guild.id, 'momentLanguage'));

    let user = msg.mentions.users.first() || msg.client.users.get(args[1]) || msg.author;

    if (!user || !args || !args.length) return msg.reply(lang.punishments_noinput);

    if (!user) {
      try {
        const fetchedMember = await msg.guild.members.fetch(args.slice(1, 2).join(' '));
        if (!fetchedMember) throw new Error('User not found!');
        user = fetchedMember;
        user = user.user;
      }
      catch (error) {
        return msg.reply(lang.punishments_usernotfound);
      }
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'punishments').length === 0) return msg.channel.send(lang.punishments_error);

    let currentPunishments = msg.client.provider.getGuild(msg.guild.id, 'punishments');

    currentPunishments = currentPunishments.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      }
      if (a.date > b.date) {
        return -1;
      }
      return 0;
    });

    const punishmentsArrayOfTheUser = [];
    let indexCount = 0;
    for (let i = 0; i < currentPunishments.length; i += 1) {
      if (user.id === currentPunishments[i].userId) {
        const moderator = msg.guild.member(currentPunishments[i].moderatorId) ? msg.guild.member(currentPunishments[i].moderatorId).user.tag : currentPunishments[i].moderatorId;

        indexCount++;

        const punishmentObject = {};
        punishmentObject.title = lang[`punishments_${currentPunishments[i].type}`].replace('%id', `${indexCount}.`).replace('%moderator', moderator).replace('%date', moment(currentPunishments[i].date).format('MMMM Do YYYY, h:mm:ss a'))
          .replace('%bantime', currentPunishments[i].bantime ? ms(Number(currentPunishments[i].bantime)) : 'undefined')
          .replace('%mutetime', currentPunishments[i].mutetime ? ms(Number(currentPunishments[i].mutetime)) : 'undefined');
        punishmentObject.description = lang.punishments_reason.replace('%reason', currentPunishments[i].reason);
        punishmentObject.realID = i;
        punishmentObject.shownID = indexCount;

        punishmentsArrayOfTheUser.push(punishmentObject);
      }
    }
    if (punishmentsArrayOfTheUser.length === 0) return msg.channel.send(lang.punishments_notpunished);

    const validation = ['delete', 'show', lang.punishments_parameter_show, lang.punishments_parameter_delete];
    const margs = msg.content.split(' ');
    let message;

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'show' || margs[1].toLowerCase() === lang.punishments_parameter_show.toLowerCase()) {
          const embed = new Discord.MessageEmbed()
            .setColor('#fff024')
            .setAuthor(user.tag, user.displayAvatarURL());

          const embedFields = punishmentsArrayOfTheUser.slice(0, 5);

          for (let index = 0; index < embedFields.length; index += 1) {
            embed.addField(embedFields[index].title, embedFields[index].description);
          }

          message = await msg.channel.send({ embed });

          if (punishmentsArrayOfTheUser.length <= 5) return undefined;

          const reaction1 = await message.react('◀');
          const reaction2 = await message.react('▶');

          let first = 0;
          let second = 5;

          const collector = message.createReactionCollector((reaction, user1) => user1.id === msg.author.id, {
            time: 60000
          });
          collector.on('collect', (r) => {
            const reactionadd = punishmentsArrayOfTheUser.slice(first + 5, second + 5).length;
            const reactionremove = punishmentsArrayOfTheUser.slice(first - 5, second - 5).length;

            if (r.emoji.name === '▶' && reactionadd !== 0) {
              r.users.remove(msg.author.id);
              const thefirst = punishmentsArrayOfTheUser.slice(first + 5, second + 5);

              first += 5;
              second += 5;

              const newembed = new Discord.MessageEmbed()
                .setColor('#fff024')
                .setAuthor(user.tag, user.displayAvatarURL());

              for (let index2 = 0; index2 < thefirst.length; index2++) {
                newembed.addField(thefirst[index2].title, thefirst[index2].description);
              }

              message.edit({
                embed: newembed
              });
            }
            else if (r.emoji.name === '◀' && reactionremove !== 0) {
              r.users.remove(msg.author.id);
              const thefirst = punishmentsArrayOfTheUser.slice(first - 5, second - 5);

              first -= 5;
              second -= 5;

              const newembed = new Discord.MessageEmbed()
                .setColor('#fff024')
                .setAuthor(user.tag, user.displayAvatarURL());

              for (let index2 = 0; index2 < thefirst.length; index2++) {
                newembed.addField(thefirst[index2].title, thefirst[index2].description);
              }

              message.edit({
                embed: newembed
              });
            }
          });
          collector.on('end', () => {
            reaction1.users.remove();
            reaction2.users.remove();
          });
        }
        else if (margs[1].toLowerCase() === 'delete' || margs[1].toLowerCase() === lang.punishments_parameter_delete.toLowerCase()) {
          if (args.slice(2, 3).length === 0) return msg.reply(lang.punishments_noreportid);
          if (isNaN(args.slice(2, 3).join(' '))) return msg.reply(lang.punishments_nonumber);

          for (let index = 0; index < punishmentsArrayOfTheUser.length; index += 1) {
            if (punishmentsArrayOfTheUser[index].shownID === Number(args.slice(2, 3).join(' '))) {
              currentPunishments.splice(punishmentsArrayOfTheUser[index].realID, 1);

              currentPunishments = currentPunishments.sort((a, b) => {
                if (a.date < b.date) {
                  return -1;
                }
                if (a.date > b.date) {
                  return 1;
                }
                return 0;
              });

              await msg.client.provider.setGuild(msg.guild.id, 'punishments', currentPunishments);
              return msg.reply(lang.punishments_punishmentremoved);
            }
          }
          return msg.reply(lang.punishments_nopunishmentwithid);
        }
      }
    }
    if (!message) {
      return msg.reply('Invalid command usage!');
    }
  }
};
