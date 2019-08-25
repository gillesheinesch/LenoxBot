const Discord = require('discord.js');
const ms = require('ms');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class currentlymutedCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'currentlymuted',
      group: 'moderation',
      memberName: 'currentlymuted',
      description: 'currentlymuted',
      format: 'currentlymuted [@USER/UserID]',
      aliases: ['cm'],
      examples: ['currentlymuted', 'currentlymuted @Monkeyyy11#0001', 'currentlymuted 353115097318555649'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['KICK_MEMBERS'],
      shortDescription: 'Mute',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);
    const mutesOfThisServer = [];

    for (const i in msg.client.provider.getBotsettings('botconfs', 'mutes')) {
      if (msg.client.provider.getBotsettings('botconfs', 'mutes')[i].discordserverid === msg.guild.id) {
        mutesOfThisServer.push(msg.client.provider.getBotsettings('botconfs', 'mutes')[i]);
      }
    }

    if (mutesOfThisServer.length === 0) return msg.reply(lang.currentlymuted_error);

    if (args.slice().length !== 0) {
      let user = msg.mentions.users.first();
      if (!user) {
        try {
          const fetchedMember = await msg.guild.fetchMember(args.slice().join(' '));
          if (!fetchedMember) throw new Error('User not found!');
          user = fetchedMember.user;
        }
        catch (error) {
          return msg.reply(lang.ban_idcheck);
        }
      }
      let checkIfMuted = false;
      let muteSettings;
      await mutesOfThisServer.forEach((r) => {
        if (r.memberid === user.id) {
          checkIfMuted = true;
          muteSettings = r;
        }
      });

      const notownrole = lang.unmute_notownrole.replace('%username', user.tag);
      if (!checkIfMuted) return msg.reply(notownrole);

      const userembed = new Discord.MessageEmbed()
        .setAuthor(lang.currentlymuted_embedauthor)
        .setColor('#ff9900')
        .setTimestamp();

      const embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', msg.client.users.get(muteSettings.moderatorid).tag).replace('%muteddate', new Date(muteSettings.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(muteSettings.muteEndDate - Date.now()))
        .replace('%reason', muteSettings.reason);
      userembed.addField(msg.client.users.get(muteSettings.memberid).tag, embeddescription);

      return msg.channel.send({
        embed: userembed
      });
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor(lang.currentlymuted_embedauthor)
      .setColor('#ff9900')
      .setTimestamp();

    mutesOfThisServer.slice(0, 4).forEach((rr) => {
      if (!rr.moderatorid) {
        rr.moderatorid = msg.client.user.id;
      }

      if (!rr.reason) {
        rr.reason = 'undefined';
      }

      const embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', msg.client.users.get(rr.moderatorid).tag).replace('%muteddate', new Date(rr.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(rr.muteEndDate - Date.now()))
        .replace('%reason', rr.reason);
      embed.addField(msg.client.users.get(rr.memberid).tag, embeddescription);
    });

    const message = await msg.channel.send({
      embed
    });

    if (mutesOfThisServer.length > 4) {
      const reaction1 = await message.react('◀');
      const reaction2 = await message.react('▶');

      let first = 0;
      let second = 4;

      const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
        time: 200000
      });
      collector.on('collect', (r) => {
        const reactionadd = mutesOfThisServer.slice(first + 4, second + 4).length;
        const reactionremove = mutesOfThisServer.slice(first - 4, second - 4).length;

        if (r.emoji.name === '▶' && reactionadd !== 0) {
          r.users.remove(msg.author.id);

          first += 4;
          second += 4;

          const newembed = new Discord.MessageEmbed()
            .setAuthor(lang.currentlymuted_embedauthor)
            .setColor('#ff9900')
            .setTimestamp();

          mutesOfThisServer.slice(first, second).forEach((rrr) => {
            if (!rrr.moderatorid) {
              rrr.moderatorid = msg.client.user.id;
            }

            if (!r.reason) {
              rrr.reason = 'undefined';
            }

            const embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', msg.client.users.get(rrr.moderatorid).tag).replace('%muteddate', new Date(rrr.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(rrr.muteEndDate - Date.now()))
              .replace('%reason', rrr.reason);
            newembed.addField(msg.client.users.get(rrr.memberid).tag, embeddescription);
          });

          message.edit({
            embed: newembed
          });
        }
        else if (r.emoji.name === '◀' && reactionremove !== 0) {
          r.users.remove(msg.author.id);

          first -= 4;
          second -= 4;

          const newembed = new Discord.MessageEmbed()
            .setAuthor(lang.currentlymuted_embedauthor)
            .setColor('#ff9900')
            .setTimestamp();

          mutesOfThisServer.slice(first, second).forEach((rrr) => {
            if (!rrr.moderatorid) {
              rrr.moderatorid = msg.client.user.id;
            }

            if (!r.reason) {
              rrr.reason = 'undefined';
            }

            const embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', msg.client.users.get(rrr.moderatorid).tag).replace('%muteddate', new Date(rrr.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(rrr.muteEndDate - Date.now()))
              .replace('%reason', rrr.reason);
            newembed.addField(msg.client.users.get(rrr.memberid).tag, embeddescription);
          });

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
  }
};
