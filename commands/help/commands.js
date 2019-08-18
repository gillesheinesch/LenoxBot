const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class commandsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'commands',
      group: 'help',
      memberName: 'commands',
      description: 'Help',
      format: 'commands {name of the module}',
      aliases: ['cmds'],
      examples: ['commands help', 'commands administration'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Help',
      dashboardsettings: false
    });
  }

  async run(msg) {
    const Discord = require('discord.js');
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'botowner', 'moderation', 'staff', 'application', 'currency', 'partner', 'tickets', 'customcommands'];
    const margs = msg.content.split(' ');

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        for (let index = 0; index < validation.length; index += 1) {
          if (margs[1].toLowerCase() === validation[index]) {
            if (validation[index] === 'botowner' && !settings.owners.includes(msg.author.id)) {
              return msg.channel.send(lang.botownercommands_error);
            }

            if (typeof msg.client.guilds.get(settings.botMainDiscordServer) !== 'undefined') {
              const moderatorRole = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'moderator').id;
              if (validation[index] === 'staff' && !msg.member.roles.get(moderatorRole)) {
                return msg.channel.send(lang.botownercommands_error);
              }
            }
            const commandShortDescriptions = [];
            const embed = new Discord.MessageEmbed()
              .setDescription(lang[`modules_${validation[index].toLowerCase()}`] ? lang[`modules_${validation[index].toLowerCase()}`] : 'No description')
              .setColor('#009900');
            const commands = msg.client.registry.commands.filter((c) => c.groupID === validation[index]).array();

            for (let index2 = 0; index2 < commands.length; index2++) {
              if (!commandShortDescriptions.includes(commands[index2].shortDescription)) {
                commandShortDescriptions.push(commands[index2].shortDescription);
              }
            }
            for (let index3 = 0; index3 < commandShortDescriptions.slice(0, 7).length; index3++) {
              const newCommands = commands.filter((c) => c.shortDescription.toLowerCase() === commandShortDescriptions[index3].toLowerCase());
              const shortDescriptionCheck = await lang[`commands_${commandShortDescriptions[index3].toLowerCase()}`];
              embed.addField(typeof shortDescriptionCheck === 'undefined' ? commandShortDescriptions[index3] : lang[`commands_${commandShortDescriptions[index3].toLowerCase()}`], `\`\`\`asciidoc\n${newCommands.map((cmd) => `${prefix}${cmd.name} :: ${lang[`${cmd.name}_description`] ? lang[`${cmd.name}_description`] : cmd.description}`).join('\n')}\`\`\``);
            }
            const message = await msg.channel.send({
              embed
            });

            if (commandShortDescriptions.length <= 7) return;
            const reaction1 = await message.react('◀');
            const reaction2 = await message.react('▶');

            let first = 0;
            let second = 7;

            const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
              time: 60000
            });
            collector.on('collect', (r) => {
              const reactionadd = commandShortDescriptions.slice(first + 7, second + 7).length;
              const reactionremove = commandShortDescriptions.slice(first - 7, second - 7).length;

              if (r.emoji.name === '▶' && reactionadd !== 0) {
                r.users.remove(msg.author.id);
                const newCommandShortDescriptions = commandShortDescriptions.slice(first + 7, second + 7);
                const newEmbed = new Discord.MessageEmbed()
                  .setColor('#009900');

                for (let index2 = 0; index2 < newCommandShortDescriptions.length; index2++) {
                  const new2Commands = commands.filter((c) => c.shortDescription.toLowerCase() === newCommandShortDescriptions[index2].toLowerCase());
                  newEmbed.addField(lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] ? lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] : newCommandShortDescriptions[index2], `\`\`\`asciidoc\n${new2Commands.map((cmd) => `${prefix}${cmd.name} :: ${lang[`${cmd.name}_description`] ? lang[`${cmd.name}_description`] : cmd.description}`).join('\n')}\`\`\``);
                }

                first += 7;
                second += 7;

                message.edit({
                  embed: newEmbed
                });
              }
              else if (r.emoji.name === '◀' && reactionremove !== 0) {
                r.users.remove(msg.author.id);
                const newCommandShortDescriptions = commandShortDescriptions.slice(first - 7, second - 7);
                const newEmbed = new Discord.MessageEmbed()
                  .setColor('#009900');

                for (let index2 = 0; index2 < newCommandShortDescriptions.length; index2++) {
                  const new2Commands = commands.filter((c) => c.shortDescription.toLowerCase() === newCommandShortDescriptions[index2].toLowerCase());
                  newEmbed.addField(lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] ? lang[`commands_${newCommandShortDescriptions[index2].toLowerCase()}`] : newCommandShortDescriptions[index2], `\`\`\`asciidoc\n${new2Commands.map((cmd) => `${prefix}${cmd.name} :: ${lang[`${cmd.name}_description`] ? lang[`${cmd.name}_description`] : cmd.description}`).join('\n')}\`\`\``);
                }

                first -= 7;
                second -= 7;

                message.edit({
                  embed: newEmbed
                });
              }
            });
            collector.on('end', () => {
              reaction1.users.remove();
              reaction2.users.remove();
            });
            return;
          }
        }
      }
    }
    const error = lang.commands_error.replace('%prefixmodules', `\`${prefix}modules\``);
    return msg.channel.send(error);
  }
};
