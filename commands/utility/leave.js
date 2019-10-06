const LenoxCommand = require('../LenoxCommand.js');

module.exports = class leaveCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'leave',
      group: 'utility',
      memberName: 'leave',
      description: 'Leave a self-assignable role',
      format: 'leave {rolename}',
      aliases: [],
      examples: ['leave Member'],
      clientpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES'],
      userpermissions: [],
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
    const author = await msg.guild.members.fetch(msg.author.id);

    if (addedrole.length < 1) return msg.reply(lang.leave_noinput);
    if (!foundRole) return msg.reply(lang.leave_rolenotexist);
    if (!msg.member.roles.has(foundRole.id)) return msg.reply(lang.leave_error);

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'selfassignableroles').length; i += 1) {
      if (foundRole.id === msg.client.provider.getGuild(msg.guild.id, 'selfassignableroles')[i]) {
        try {
          return author.roles.remove(foundRole).then(() => msg.reply(lang.leave_roleremoved));
        }
        catch (error) {
          return msg.channel.send(lang.leave_nopermission);
        }
      }
    }
    return msg.reply(lang.join_notwhitelisted);
  }
};
