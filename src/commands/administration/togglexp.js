const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class togglexpCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'togglexp',
      group: 'administration',
      memberName: 'togglexp',
      description: 'Add channels in which you can not win XP',
      format: 'togglexp {add/remove/list} [channelname]',
      aliases: [],
      examples: ['togglexp add spam', 'togglexp remove spam', 'togglexp list'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['MANAGE_GUILD'],
      shortDescription: 'XP',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const validation = ['list', 'add', 'remove', lang.togglexp_parameter_add, lang.togglexp_parameter_remove, lang.togglexp_parameter_list];
    const margs = msg.content.split(' ');
    const input = args.slice();
    let channel;

    if (!input || input.length === 0) return msg.reply(lang.togglexp_noinput);

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'add' || margs[1].toLowerCase() === lang.togglexp_parameter_add.toLowerCase()) {
          try {
            channel = msg.guild.channels.find((r) => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
            if (channel === null) throw new Error('undefined');
          }
          catch (error) {
            return msg.channel.send(lang.togglexp_notexist);
          }
          if (channel.type !== 'text') return msg.reply(lang.togglexp_notextchannel);

          if (msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.length !== 0) {
            for (let index = 0; index < msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.length; index += 1) {
              if (msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids[index] === channel.id) return msg.reply(lang.togglexp_alreadyadd);
            }
          }
          const currentTogglexp = msg.client.provider.getGuild(msg.guild.id, 'togglexp');
          currentTogglexp.channelids.push(channel.id);
          await msg.client.provider.setGuild(msg.guild.id, 'togglexp', currentTogglexp);

          const add = lang.togglexp_add.replace('%channelname', channel.name);
          return msg.reply(add);
        } if (margs[1].toLowerCase() === 'remove' || margs[1].toLowerCase() === lang.togglexp_parameter_remove.toLowerCase()) {
          if (msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.length === 0) return msg.reply(lang.togglexp_nochannel);

          let channel2;
          try {
            channel2 = msg.guild.channels.find((r) => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
            if (channel2 === null) throw new Error('undefined');
          }
          catch (error) {
            return msg.channel.send(lang.togglexp_notexist);
          }
          if (channel2.type !== 'text') return msg.reply(lang.togglexp_notextchannel);

          for (let index2 = 0; index2 < msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.length; index2++) {
            if (channel2.id === msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids[index2]) {
              const currentTogglexp = msg.client.provider.getGuild(msg.guild.id, 'togglexp');
              currentTogglexp.channelids.splice(index2, 1);
              await msg.client.provider.setGuild(msg.guild.id, 'togglexp', currentTogglexp);

              const remove = lang.togglexp_remove.replace('%channelname', channel2.name);
              return msg.reply(remove);
            }
          }
          return msg.reply(lang.togglexp_notinthelist);
        } if (margs[1].toLowerCase() === 'list' || margs[1].toLowerCase() === lang.togglexp_parameter_list.toLowerCase()) {
          if (msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.length === 0) return msg.reply(lang.togglexp_nochannel);

          const array = [];

          for (let index3 = 0; index3 < msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.length; index3++) {
            try {
              const channelname = msg.guild.channels.get(msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids[index3]).name;
              array.push(`${channelname} (${msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids[index3]})`);
            }
            catch (error) {
              const currentTogglexp = msg.client.provider.getGuild(msg.guild.id, 'togglexp');
              currentTogglexp.channelids.splice(index3, 1);
              await msg.client.provider.setGuild(msg.guild.id, 'togglexp', currentTogglexp);
            }
          }
          const embed = new Discord.MessageEmbed()
            .setColor('#ff9933')
            .setDescription(array.join('\n'))
            .setAuthor(lang.togglexp_embed);

          return msg.channel.send({
            embed
          });
        }
      }
    }
    return msg.reply(lang.togglexp_error);
  }
};
