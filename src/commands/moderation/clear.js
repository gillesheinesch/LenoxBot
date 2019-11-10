const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class clearCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'clear',
      group: 'moderation',
      memberName: 'clear',
      description: 'Deletes for you the last X messages that were sent in the current channel',
      format: 'clear {amount of messages between 2 and 100} {reason}',
      aliases: ['purge'],
      examples: ['clear 50 test'],
      clientpermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      userpermissions: ['MANAGE_MESSAGES'],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (args.slice().length === 0) return msg.reply(lang.clear_error);
    if (isNaN(args.slice(0, 1).join(' '))) return msg.reply(lang.clear_number);

    const messagecount = parseInt(args.slice(0, 1).join(' '), 10);
    if (messagecount > 100) return msg.reply(lang.clear_max100);
    if (messagecount < 2) return msg.reply(lang.clear_min2);

    const reason = args.slice(1, 2);
    if (!reason || !reason.length) return msg.reply(lang.clear_noreason);

    if (msg.client.provider.getGuild(msg.guild.id, 'commanddel') === 'false') {
      await msg.delete();
    }

    await msg.channel.messages.fetch({ limit: messagecount }).then(async (messages) => {
      await msg.channel.bulkDelete(messages);

      const embedtitle = lang.clear_embedtitle.replace('%amount', messagecount).replace('%user', `${msg.author.username}${msg.author.discriminator}`);
      const modLogEmbed = new Discord.MessageEmbed()
        .setAuthor(embedtitle, msg.author.displayAvatarURL())
        .setColor('ORANGE')
        .setTimestamp()
        .addField(lang.clear_embedreason, reason);

      if (msg.client.provider.getGuild(msg.guild.id, 'modlog') === 'true') {
        const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'modlogchannel'));
        modlogchannel.send({ embed: modLogEmbed });
      }

      const messagesdeleted = lang.clear_messagesdeleted.replace('%messagecount', messagecount);
      const messageclearembed = new Discord.MessageEmbed()
        .setColor('#99ff66')
        .setDescription(`✅ ${messagesdeleted}`);
      return msg.channel.send({ embed: messageclearembed }).then((message) => {
        setTimeout(async () => {
          if (await msg.channel.messages.fetch(message.id)) {
            message.delete();
          }
        }, 10000);
      });
    }).catch((error) => {
      if (error.message === 'You can only bulk delete messages that are under 14 days old.') return msg.reply(lang.clear_error14days);
      return msg.reply(lang.clear_errorgeneral);
    });
  }
};
