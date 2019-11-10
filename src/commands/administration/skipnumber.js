const LenoxCommand = require('../LenoxCommand.js');

module.exports = class skipnumberCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'skipnumber',
      group: 'administration',
      memberName: 'skipnumber',
      description: 'Changes the necessary votes to skip music for users',
      format: 'skipnumber {number}',
      aliases: [],
      examples: ['skipnumber 3'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Music',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const number = args.slice();

    if (!msg.client.provider.getGuild(msg.guild.id, 'skipnumber')) {
      await msg.client.provider.setGuild(msg.guild.id, 'skipnumber', 1);
    }

    const currentvotenumber = lang.skipnumber_currentvotenumber.replace('%skipnumber', `\`${msg.client.provider.getGuild(msg.guild.id, 'skipnumber')}\``);

    if (number.length === 0) return msg.channel.send(currentvotenumber);
    if (number.length > 1) return msg.channel.send(lang.skipnumber_error);
    if (isNaN(number)) return msg.channel.send(lang.skipnumber_noinput);
    if (number < 1) return msg.channel.send(lang.skipnumber_cannotbe0);

    await msg.client.provider.setGuild(msg.guild.id, 'skipnumber', number);

    const changedskipvote = lang.skipnumber_changedskipvote.replace('%newskipnumber', number);
    return msg.channel.send(changedskipvote);
  }
};
