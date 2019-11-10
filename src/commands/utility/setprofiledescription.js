const LenoxCommand = require('../LenoxCommand.js');

module.exports = class setprofiledescriptionCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'setprofiledescription',
      group: 'utility',
      memberName: 'setprofiledescription',
      description: 'Sets a global profile description',
      format: 'setprofiledescription {description}',
      aliases: [],
      examples: ['setprofiledescription 27y/o | Love Lenoxbot | pilot at American Airline'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Settings',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const input = args.slice();

    if (!input || input.length === 0) return msg.reply(lang.setprofiledescription_noinput);
    if (input.join(' ').length > 100 && msg.client.provider.getUser(msg.author.id, 'premium').status === false) return msg.reply(lang.setprofiledescription_error);
    if (input.join(' ').length > 400) return msg.reply(lang.setprofiledescription_error2);

    await msg.client.provider.setUser(msg.author.id, 'description', input.join(' '));

    msg.channel.send(lang.setprofiledescription_set);
  }
};
