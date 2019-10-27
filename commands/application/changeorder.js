const LenoxCommand = require('../LenoxCommand.js');

module.exports = class changeorderCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'changeorder',
      group: 'application',
      memberName: 'changeorder',
      description: 'Changes the order of application entries',
      format: 'changeorder {first application entry ID} {second application entry ID}',
      aliases: [],
      examples: ['changeorder 1 2', 'changeorder 3 1'],
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
    const secondNumber = args.slice(1, 2);

    if (firstNumber.length === 0 || secondNumber.length === 0) return msg.reply(lang.changeorder_error);
    if (isNaN(firstNumber) || isNaN(secondNumber)) return msg.reply(lang.changeorder_notcorrectused);
    if (firstNumber === secondNumber) return msg.reply(lang.changeorder_same);
    if (typeof msg.client.provider.getGuild(msg.guild.id, 'application').template[Number(firstNumber) - 1] === 'undefined' || typeof msg.client.provider.getGuild(msg.guild.id, 'application').template[Number(secondNumber) - 1] === 'undefined') return msg.reply(lang.changeorder_undefined);

    const firstEntry = msg.client.provider.getGuild(msg.guild.id, 'application').template[Number(firstNumber) - 1];
    const secondEntry = msg.client.provider.getGuild(msg.guild.id, 'application').template[Number(secondNumber) - 1];

    const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
    currentApplication.template[Number(secondNumber) - 1] = firstEntry;
    currentApplication.template[Number(firstNumber) - 1] = secondEntry;
    await msg.client.provider.setGuild(msg.guild.id, 'application', currentApplication);

    msg.reply(lang.changeorder_set);
  }
};
