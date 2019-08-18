const LenoxCommand = require('../LenoxCommand.js');

module.exports = class addentryCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'addentry',
      group: 'application',
      memberName: 'addentry',
      description: 'Inserts a new entry in the template',
      format: 'addentry {new entry}',
      aliases: [],
      examples: ['addentry How old are you?'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Entries',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const input = args.slice().join(' ');

    if (input.length < 1) return msg.reply(lang.addentry_noinput);

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'application').template.length; i += 1) {
      if (msg.client.provider.getGuild(msg.guild.id, 'application').template[i].toLowerCase() === input.toLowerCase()) return msg.channel.send(lang.addentry_alreadyexists);
    }

    const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
    currentApplication.template.push(input);
    await msg.client.provider.setGuild(msg.guild.id, 'application', currentApplication);

    const added = lang.addentry_added.replace('%entry', `\`${input}\``);
    return msg.channel.send(added);
  }
};
