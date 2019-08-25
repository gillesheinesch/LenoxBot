const LenoxCommand = require('../LenoxCommand.js');

module.exports = class togglecommandCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'togglecommand',
      group: 'administration',
      memberName: 'togglecommand',
      description: 'Toggles the status of a command',
      format: 'togglecommand {name of the command}',
      aliases: [],
      examples: ['togglecommand ban', 'togglecommand kick'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (args.slice().length === 0) return msg.reply(lang.togglecommand_noinput);

    /* eslint no-else-return: 0 */
    for (const x in msg.client.provider.getGuild(msg.guild.id, 'commands')) {
      if (x.toLowerCase() === args.slice().join(' ').toLowerCase()) {
        if (msg.client.registry.commands.get(x.toLowerCase()).dashboardsettings === false) return msg.reply(lang.togglecommand_notchangeable);
        if (msg.client.provider.getGuild(msg.guild.id, 'commands')[x.toLowerCase()].status === 'true') {
          const currentCommands = await msg.client.provider.getGuild(msg.guild.id, 'commands');
          currentCommands[x.toLowerCase()].status = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'commands', currentCommands);

          return msg.reply(lang.togglecommand_settofalse);
        }
        else {
          const currentCommands = await msg.client.provider.getGuild(msg.guild.id, 'commands');
          currentCommands[x.toLowerCase()].status = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'commands', currentCommands);
          return msg.reply(lang.togglecommand_settotrue);
        }
      }
    }
    return msg.reply(lang.togglecommand_nocommand);
  }
};
