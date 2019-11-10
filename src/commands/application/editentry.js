const LenoxCommand = require('../LenoxCommand.js');

module.exports = class editentryCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'editentry',
      group: 'application',
      memberName: 'editentry',
      description: 'Edits an application entry text',
      format: 'editentry {application entry ID} {new application entry text}',
      aliases: [],
      examples: ['editentry 1 Hello dear applicant'],
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

    const firstNumber = args.slice(0, 1);
    const newEntryText = args.slice(1);

    if (firstNumber.length === 0) return msg.reply(lang.editentry_noid);
    if (newEntryText.length === 0) return msg.reply(lang.editentry_noentrytext);
    if (isNaN(firstNumber)) return msg.reply(lang.editentry_noid);
    if (typeof msg.client.provider.getGuild(msg.guild.id, 'application').template[Number(firstNumber) - 1] === 'undefined') return msg.reply(lang.editentry_undefined);

    const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
    currentApplication.template[Number(firstNumber) - 1] = newEntryText.join(' ');
    await msg.client.provider.setGuild(msg.guild.id, 'application', currentApplication);

    const set = lang.editentry_set.replace('%id', firstNumber);
    msg.reply(set);
  }
};
