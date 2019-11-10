require('moment-duration-format');
const Discord = require('discord.js');
const ms = require('ms');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class currentjobCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'currentjob',
      group: 'currency',
      memberName: 'currentjob',
      description: 'Allows you to see your current job',
      format: 'currentjob',
      aliases: [],
      examples: ['currentjob'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (msg.client.provider.getUser(msg.author.id, 'jobstatus') === false) return msg.reply(lang.currentjob_nojob);

    const currentJobreminder = msg.client.provider.getBotsettings('botconfs', 'jobreminder');
    const currentUserJob = currentJobreminder[msg.author.id];

    if (!currentUserJob) return msg.reply(lang.currentjob_nojob);

    const embedtitle = lang.currentjob_embedtitle.replace('%title', currentUserJob.job);
    const embeddescription = lang.currentjob_embeddescription.replace('%time', ms(currentUserJob.remind - Date.now()));
    const jobEmbed = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setTimestamp()
      .setTitle(embedtitle)
      .setDescription(embeddescription);

    msg.reply({ embed: jobEmbed });
  }
};
