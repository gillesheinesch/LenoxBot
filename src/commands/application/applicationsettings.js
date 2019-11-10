const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class applicationsettingsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'applicationsettings',
      group: 'application',
      memberName: 'applicationsettings',
      description: 'Shows you all settings of the application system',
      format: 'applicationsettings',
      aliases: [],
      examples: ['applicationsettings'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['MANAGE_GUILD'],
      shortDescription: 'Settings',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const embed = new Discord.MessageEmbed()
      .setDescription(`${lang.applicationsettings_applicationstatus} \`${msg.client.provider.getGuild(msg.guild.id, 'application').status === 'false' ? lang.applicationsettings_deactivated : lang.applicationsettings_activated}\` \n\
${lang.applicationsettings_reactionnnumber} \`${msg.client.provider.getGuild(msg.guild.id, 'application').reactionnumber === '' ? lang.serverinfo_emojisnone : msg.client.provider.getGuild(msg.guild.id, 'application').reactionnumber}\`\n\
${lang.applicationsettings_approverole} \`${msg.client.provider.getGuild(msg.guild.id, 'application').role === '' ? lang.applicationsettings_norole : msg.guild.roles.get(msg.client.provider.getGuild(msg.guild.id, 'application').role).name}\` \n\
${lang.applicationsettings_denyrole} \`${msg.client.provider.getGuild(msg.guild.id, 'application').denyrole === '' ? lang.applicationsettings_norole : msg.guild.roles.get(msg.client.provider.getGuild(msg.guild.id, 'application').denyrole).name}\` \n`)
      .addField(lang.applicationsettings_entries, msg.client.provider.getGuild(msg.guild.id, 'application').template.length === 0 ? lang.serverinfo_emojisnone : msg.client.provider.getGuild(msg.guild.id, 'application').template.join('\n'))
      .setAuthor(lang.applicationsettings_embedauthor)
      .setColor('#00ff00');

    msg.channel.send({
      embed
    });
  }
};
