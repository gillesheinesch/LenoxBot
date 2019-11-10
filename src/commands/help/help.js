const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class helpCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'help',
      group: 'help',
      memberName: 'help',
      description: 'TODO: Setdescription',
      format: 'help [commandname]',
      aliases: ['h'],
      examples: ['help botinfo', 'help'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Help',
      dashboardsettings: false
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');
    let command = args[0];

    if (!args[0]) {
      const embed = new Discord.MessageEmbed()
        .addField(lang.help_addthebot, 'https://lenoxbot.com/invite/')
        .addField(lang.help_discordserver, 'https://lenoxbot.com/discord/')
        .addField(lang.help_modulecommand, `${prefix}modules`)
        .addField(lang.help_commandscommand, `${prefix}commands {${lang.help_modulename}}`)
        .addField(lang.help_helpcommand, `${prefix}help {${lang.help_command}}`)
        .addField(lang.botinfo_website, 'https://lenoxbot.com/')
        .addField(lang.help_translation, 'https://crowdin.com/project/lenoxbot')
        .addField(lang.help_status, 'https://status.lenoxbot.com/')
        .setColor('#ff3300')
        .setAuthor(msg.client.user.username, msg.client.user.displayAvatarURL());

      return msg.channel.send({ embed });
    }

    if (msg.client.registry.commands.has(command)) {
      command = msg.client.registry.commands.get(command);

      if (command.groupID === 'botowner' && msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

      const aliases = [];
      if (command.aliases.length !== 0) {
        for (let i = 0; i < command.aliases.length; i += 1) {
          aliases.push(`${prefix}${command.aliases[i]}`);
        }
      }

      const examples = [];
      if (command.examples.length !== 0) {
        for (let i = 0; i < command.examples.length; i += 1) {
          examples.push(`${prefix}${command.examples[i]}`);
        }
      }

      const category = lang.help_category.replace('%category', command.groupID);

	  let commandFormat;
      if (Array.isArray(lang[`${command.name}_format`])) {
        commandFormat = [];
        for (let i = 0; i < lang[`${command.name}_format`].length; i += 1) {
          commandFormat.push(lang[`${command.name}_format`][i].replace('%prefix', prefix).replace('%commandname', command.name));
        }
      }
      else {
        commandFormat = lang[`${command.name}_format`].replace('%prefix', prefix).replace('%commandname', command.name);
	  }
      const commandembed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor(`${prefix}${command.aliases.length === 0 ? command.name : `${command.name} / `} ${aliases.join(' / ')}`)
        .setDescription(lang[`${command.name}_description`])
        .addField(lang.help_usage, Array.isArray(lang[`${command.name}_format`]) ? commandFormat.join('\n') : commandFormat)
        .addField(lang.help_permissions, command.userpermissions.length === 0 ? '/' : command.userpermissions.join(', '))
        .addField(lang.help_example, examples.length === 0 ? '/' : examples.join('\n'))
        .setFooter(category);

      return msg.channel.send({ embed: commandembed });
    }
    else {
      /* eslint guard-for-in: 0 */
      /* eslint no-else-return: 0 */
      for (let key = 0; key < msg.client.registry.commands.array().length; key += 1) {
        if (msg.client.registry.commands.array()[key].aliases.includes(command)) {
          command = msg.client.registry.commands.array()[key];

          if (command.groupID === 'botowner' && msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

          const aliases = [];
          if (command.aliases.length !== 0) {
            for (let i = 0; i < command.aliases.length; i += 1) {
              aliases.push(`${prefix}${command.aliases[i]}`);
            }
          }

          const examples = [];
          if (command.examples.length !== 0) {
            for (let i = 0; i < command.examples.length; i += 1) {
              examples.push(`${prefix}${command.examples[i]}`);
            }
          }

          const category = lang.help_category.replace('%category', command.groupID);
          let commandFormat;
          if (Array.isArray(lang[`${command.name}_format`])) {
            commandFormat = [];
            for (let i = 0; i < lang[`${command.name}_format`].length; i += 1) {
              commandFormat.push(lang[`${command.name}_format`][i].replace('%prefix', prefix).replace('%commandname', command.name));
            }
          }
          else {
            commandFormat = lang[`${command.name}_format`].replace('%prefix', prefix).replace('%commandname', command.name);
	  }
          const aliasembed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`${prefix}${command.aliases.length === 0 ? command.name : `${command.name} / `} ${aliases.join(' / ')}`)
            .setDescription(lang[`${command.name}_description`])
            .addField(lang.help_usage, Array.isArray(lang[`${command.name}_format`]) ? commandFormat.join('\n') : commandFormat)
            .addField(lang.help_permissions, command.userpermissions.length === 0 ? '/' : command.userpermissions.join(', '))
            .addField(lang.help_example, examples.length === 0 ? '/' : examples.join('\n'))
            .setFooter(category);
          return msg.channel.send({ embed: aliasembed });
        }
      }
    }
    return msg.channel.send(lang.help_error);
  }
};
