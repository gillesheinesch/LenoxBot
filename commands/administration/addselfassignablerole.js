const LenoxCommand = require('../LenoxCommand.js');

module.exports = class addselfassignableroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'addselfassignablerole',
      group: 'administration',
      memberName: 'addselfassignablerole',
      description: 'Add a role that allows users to assign themselves',
      format: 'addselfassignablerole {name of the role}',
      aliases: ['asar'],
      examples: ['addselfassignablerole Member'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Selfassignableroles',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const addedrole = args.slice().join(' ');
    const foundRole = msg.guild.roles.find((role) => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());

    if (addedrole.length < 1) return msg.reply(lang.addselfassignablerole_norolename);
    if (!foundRole) return msg.reply(lang.addselfassignablerole_rolenotexist);
    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'selfassignableroles').length; i += 1) {
      if (foundRole.id === msg.client.provider.getGuild(msg.guild.id, 'selfassignableroles')[i]) return msg.channel.send(lang.addselfassignablerole_alreadyadded);
    }
    const roleId = foundRole.id;
    const currentSelfassignableroles = msg.client.provider.getGuild(msg.guild.id, 'selfassignableroles');
    currentSelfassignableroles.push(roleId);
    await msg.client.provider.setGuild(msg.guild.id, 'selfassignableroles', currentSelfassignableroles);

    return msg.channel.send(lang.addselfassignablerole_roleset);
  }
};
