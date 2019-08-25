const LenoxCommand = require('../LenoxCommand.js');

module.exports = class penissizecalculatorCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'penissizecalculator',
      group: 'fun',
      memberName: 'penissizecalculator',
      description: 'Calculates the size of the penis of you or a user',
      format: 'penissizecalculator [@User]',
      aliases: ['psc'],
      examples: ['penissizecalculator', 'penissizecalculator @Tester#8234'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Jokes',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const pscAnswers = [];
    for (const x in lang) {
      if (x.includes('penissizecalculator_answer')) {
        pscAnswers.push(lang[x]);
      }
    }
    const pscAnswersIndex = Math.floor(Math.random() * pscAnswers.length);

    if (!msg.mentions.members.first()) {
      return msg.channel.send(`${msg.author}, ${pscAnswers[pscAnswersIndex]}`);
    }
    msg.channel.send(`${msg.mentions.members.first().displayName}, ${pscAnswers[pscAnswersIndex]}`);
  }
};
