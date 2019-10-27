const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class joinroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'joinrole',
      group: 'administration',
      memberName: 'joinrole',
      description: 'Roles that new guildmembers will get when they join the Discord server',
      format: 'joinrole {add, remove, list} [name of the role]',
      aliases: [],
      examples: ['joinrole list', 'joinrole add test', 'joinrole remove test'],
      category: 'administration',
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Roles',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const validation = ['add', 'list', 'remove', lang.joinrole_parameter_remove, lang.joinrole_parameter_add, lang.joinrole_parameter_list];
    const margs = msg.content.split(' ');

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'add' || margs[1].toLowerCase() === lang.joinrole_parameter_add.toLowerCase()) {
          if (!args || args.length === 0) return msg.reply(lang.joinrole_noinput);
          const mentionedRole = args.slice(1).join(' ');
          const foundRole = msg.guild.roles.find((role) => role.name.toLowerCase() === mentionedRole.toLowerCase());
          if (!foundRole) return msg.reply(lang.joinrole_rolenotexist);
          if (msg.client.provider.getGuild(msg.guild.id, 'joinroles').includes(foundRole.id)) return msg.reply(lang.joinrole_alreadyadded);
          if (msg.client.provider.getGuild(msg.guild.id, 'joinroles').length >= 5) return msg.reply(lang.joinrole_maximum);

          const currentJoinroles = msg.client.provider.getGuild(msg.guild.id, 'joinroles');
          currentJoinroles.push(foundRole.id);
          await msg.client.provider.setGuild(msg.guild.id, 'joinroles', currentJoinroles);

          return msg.reply(lang.joinrole_roleadded);
        } if (margs[1].toLowerCase() === 'remove' || margs[1].toLowerCase() === lang.joinrole_parameter_remove.toLowerCase()) {
          if (!args || args.length === 0) return msg.reply(lang.joinrole_noinputremove);
          const mentionedRole = args.slice(1).join(' ');
          const foundRole = msg.guild.roles.find((role) => role.name.toLowerCase() === mentionedRole.toLowerCase());
          if (!foundRole) return msg.reply(lang.joinrole_rolenotexist);

          if (!msg.client.provider.getGuild(msg.guild.id, 'joinroles').includes(foundRole.id)) return msg.reply(lang.joinrole_notadded);

          const indexOfTheRole = msg.client.provider.getGuild(msg.guild.id, 'joinroles').indexOf(foundRole.id);
          const currentJoinroles = msg.client.provider.getGuild(msg.guild.id, 'joinroles');
          currentJoinroles.splice(indexOfTheRole, 1);
          await msg.client.provider.setGuild(msg.guild.id, 'joinroles', currentJoinroles);

          return msg.reply(lang.joinrole_roleremoved);
        } if (margs[1].toLowerCase() === 'list' || margs[1].toLowerCase() === lang.joinrole_parameter_list.toLowerCase()) {
          if (msg.client.provider.getGuild(msg.guild.id, 'joinroles').length === 0) return msg.reply(lang.joinrole_nojoinroles);

          const joinroleEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(lang.joinrole_embedtitle)
            .setColor('BLUE');

          const arrayForEmbedDescription = [];
          for (let index = 0; index < msg.client.provider.getGuild(msg.guild.id, 'joinroles').length; index += 1) {
            if (!msg.guild.roles.get(msg.client.provider.getGuild(msg.guild.id, 'joinroles')[index])) {
              const indexOfTheRole = msg.client.provider.getGuild(msg.guild.id, 'joinroles').indexOf(msg.client.provider.getGuild(msg.guild.id, 'joinroles')[index]);
              const currentJoinroles = msg.client.provider.getGuild(msg.guild.id, 'joinroles');
              currentJoinroles.splice(indexOfTheRole, 1);
              await msg.client.provider.setGuild(msg.guild.id, 'joinroles', currentJoinroles);
            }

            if (msg.client.provider.getGuild(msg.guild.id, 'joinroles').length !== 0) {
              const joinrole = msg.guild.roles.get(msg.client.provider.getGuild(msg.guild.id, 'joinroles')[index]);
              arrayForEmbedDescription.push(`${joinrole.name} (${joinrole.id})`);
            }
          }
          joinroleEmbed.setDescription(arrayForEmbedDescription.join('\n'));

          return msg.channel.send({
            embed: joinroleEmbed
          });
        }
      }
    }
    const invalidvalidation = lang.joinrole_invalidvalidation.replace('%prefix', prefix);
    return msg.reply(invalidvalidation);
  }
};
