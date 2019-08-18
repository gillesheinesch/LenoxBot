const LenoxCommand = require('../LenoxCommand.js');

module.exports = class createcustomcommandCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'createcustomcommand',
      group: 'customcommands',
      memberName: 'createcustomcommand',
      description: 'Creates a custom command',
      format: 'createcustomcommand {name of the custom command} {response of the custom command}',
      aliases: ['ccc'],
      examples: ['createcustomcommand welcome Hello World!'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Customcommands',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (!args || args.slice().length === 0) return msg.reply(lang.createcustomcommand_noinput);
    if (args.slice(1).length === 0) return msg.reply(lang.createcustomcommand_nocommandanswer);
    if (msg.client.provider.getGuild(msg.guild.id, 'premium').status === false && msg.client.provider.getGuild(msg.guild.id, 'customcommands').length >= 5) return msg.reply(lang.createcustomcommand_premiumneeded);

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'customcommands').length; i += 1) {
      if (msg.client.provider.getGuild(msg.guild.id, 'customcommands')[i].name.toLowerCase() === args.slice(0, 1).join(' ').toLowerCase()) return msg.reply(lang.createcustomcommand_already);
    }

    const newcommandsettings = {
      name: args.slice(0, 1).join(' ').toLowerCase(),
      creator: msg.author.id,
      commandanswer: args.slice(1).join(' '),
      descriptionOfTheCommand: '',
      embed: 'false',
      commandCreatedAt: Date.now(),
      enabled: 'true'
    };

    const currentCustomcommands = msg.client.provider.getGuild(msg.guild.id, 'customcommands');
    currentCustomcommands.push(newcommandsettings);
    await msg.client.provider.setGuild(msg.guild.id, 'customcommands', currentCustomcommands);

    return msg.reply(lang.createcustomcommand_created);
  }
};
