const LenoxCommand = require('../LenoxCommand.js');

module.exports = class createmuteroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'createmuterole',
      group: 'administration',
      memberName: 'createmuterole',
      description: 'Toggles the deletion of a command after execution',
      format: 'createmuterole',
      aliases: [],
      examples: ['createmuterole'],
      category: 'administration',
      clientpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Roles',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const newMuteRole = await msg.guild.roles.create({
      name: 'Muted'
    }, 'Lenoxbot muted role');

    const message = await msg.channel.send(lang.createmuterole_waitmessage);
    await message.channel.startTyping();

    for (let i = 0; i < msg.guild.channels.array().length; i += 1) {
      await msg.guild.channels.array()[i].overwritePermissions(newMuteRole, {
        SEND_MESSAGES: false,
        SPEAK: false,
        ADD_REACTIONS: false
      });
    }

    await message.channel.stopTyping();
    return message.edit(lang.createmuterole_done);
  }
};
