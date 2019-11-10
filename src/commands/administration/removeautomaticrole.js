const LenoxCommand = require('../LenoxCommand.js');

module.exports = class removeautomaticroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'removeautomaticrole',
      group: 'administration',
      memberName: 'removeautomaticrole',
      description: 'Removes an auto assignable role',
      format: 'removeautomaticrole {name of the role}',
      aliases: ['rar'],
      examples: ['removeautomaticrole TestRole'],
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

    const addedrole = args.slice().join(' ');

    if (addedrole.length < 1) return msg.reply(lang.removeautomaticrole_noinput);

    const roleinput = args.slice().join(' ');
    const foundRole = msg.guild.roles.find((role) => role.name.toLowerCase() === roleinput.toLowerCase());
    if (!foundRole) return msg.reply(lang.removeautomaticrole_rolenotexist);

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'ara').length; i += 2) {
      if (foundRole.id === msg.client.provider.getGuild(msg.guild.id, 'ara')[i]) {
        const roleId = foundRole.id;
        for (let index = 0; index < msg.client.provider.getGuild(msg.guild.id, 'ara').length; index += 2) {
          if (roleId === msg.client.provider.getGuild(msg.guild.id, 'ara')[index]) {
            const currentAra = msg.client.provider.getGuild(msg.guild.id, 'ara');
            currentAra.splice(index, 2);
            await msg.client.provider.setGuild(msg.guild.id, 'ara', currentAra);
          }
        }
        return msg.channel.send(lang.removeautomaticrole_roleremoved);
      }
    }
    return msg.channel.send(lang.removeautomaticrole_error);
  }
};
