const LenoxCommand = require('../LenoxCommand.js');

module.exports = class addautomaticroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'addautomaticrole',
      group: 'administration',
      memberName: 'addautomaticrole',
      description: 'Adds an auto assignable role',
      format: 'addautomaticrole {points} {name of the role}',
      aliases: ['aar'],
      examples: ['addautomaticrole 10 TestRole'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Automaticroles',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (!msg.client.provider.getGuild(msg.guild.id, 'ara')) {
      await msg.client.provider.setGuild(msg.guild.id, 'ara', []);
    }

    const input = args.slice();

    if (!input[0]) return msg.reply(lang.addautomaticrole_noinput);
    if (parseInt(input[0], 10) < 0) return msg.reply(lang.addautomaticrole_inputcannotbe0);
    if (!args.slice(1).join(' ')) return msg.reply(lang.addautomaticrole_norolename);

    const roleinput = args.slice(1).join(' ');
    const foundRole = msg.guild.roles.find((role) => role.name.toLowerCase() === roleinput.toLowerCase());
    if (!foundRole) return msg.reply(lang.addautomaticrole_rolenotexist);

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'ara').length; i += 2) {
      if (foundRole.id === msg.client.provider.getGuild(msg.guild.id, 'ara')[i]) return msg.channel.send(lang.addautomaticrole_alreadyadded);
    }
    const roleId = foundRole.id;
    const currentAra = msg.client.provider.getGuild(msg.guild.id, 'ara');
    currentAra.push(roleId);
    currentAra.push(input[0]);
    await msg.client.provider.setGuild(msg.guild.id, 'ara', currentAra);

    return msg.channel.send(lang.addautomaticrole_added);
  }
};
