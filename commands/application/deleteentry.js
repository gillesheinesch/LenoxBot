const LenoxCommand = require('../LenoxCommand.js');

module.exports = class deleteentryCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'deleteentry',
      group: 'application',
      memberName: 'deleteentry',
      description: 'Deletes an entry from the template',
      format: 'deleteentry {entry}',
      aliases: [],
      examples: ['deleteentry How old are you?'],
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

    if (input.length < 1) return msg.reply(lang.deleteentry_noinput);

    if (isNaN(input)) {
      for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'application').template.length; i += 1) {
        if (input.toLowerCase() === msg.client.provider.getGuild(msg.guild.id, 'application').template[i].toLowerCase()) {
          const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
          currentApplication.template.splice(i, 1);
          await msg.client.provider.getGuild(msg.guild.id, 'application', currentApplication);

          const removed = lang.deleteentry_removed.replace('%entry', `\`${input}\``);
          return msg.channel.send(removed);
        }
      }
    }
    else {
      const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
      currentApplication.template.splice(parseInt(input, 10) - 1, 1);
      await msg.client.provider.getGuild(msg.guild.id, 'application', currentApplication);

      const removed = lang.deleteentry_removed.replace('%entry', `\`${input}\``);
      return msg.channel.send(removed);
    }
    return msg.channel.send(lang.deleteentry_notexists);
  }
};
