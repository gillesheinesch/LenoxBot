const LenoxCommand = require('../LenoxCommand.js');

module.exports = class applicationnotificationCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'applicationnotification',
      group: 'application',
      memberName: 'applicationnotification',
      description: 'applicationnotification',
      format: 'applicationnotification',
      aliases: [],
      examples: ['applicationnotification'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Settings',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const channelid = msg.channel.id;
    if (msg.client.provider.getGuild(msg.guild.id, 'application').notificationstatus === false) {
      const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
      currentApplication.notificationstatus = true;
      currentApplication.notificationchannel = channelid;
      await msg.client.provider.setGuild(msg.guild.id, 'application', currentApplication);

      const channelset = lang.applicationnotification_channelset.replace('%channelname', `**#${msg.channel.name}**`);
      return msg.channel.send(channelset);
    }
    const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
    currentApplication.notificationstatus = false;
    await msg.client.provider.setGuild(msg.guild.id, 'application', currentApplication);

    return msg.channel.send(lang.applicationnotification_channeldeleted);
  }
};
