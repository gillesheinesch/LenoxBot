const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class leaveserverCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'leaveserver',
      group: 'botowner',
      memberName: 'leaveserver',
      description: 'Leaves a discord server on which the bot has joined',
      format: 'leaveserver {guildid}',
      aliases: [],
      examples: ['leaveserver 8738704872894987'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const guildID = args.slice().join(' ');
    if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);
    if (!guildID || isNaN(guildID)) return msg.channel.send('You must enter a guildid. For example: `352896116812939264`');

    try {
      await msg.client.guilds.get(args).leave();
    }
    catch (error) {
      return msg.reply(lang.leaveserver_nofetch);
    }

    const done = lang.leaveserver_done.replace('%guildid', guildID);
    return msg.channel.send(done);
  }
};
