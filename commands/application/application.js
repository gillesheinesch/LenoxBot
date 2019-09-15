const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class applicationCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'application',
      group: 'application',
      memberName: 'application',
      description: 'Creates a new application on this server',
      format: 'application',
      aliases: ['apply'],
      examples: ['application'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const error = lang.toggleapplication_error.replace('%prefix', prefix);
    if (msg.client.provider.getGuild(msg.guild.id, 'application').status === 'false') return msg.channel.send(error);

    const addentry = lang.application_addentry.replace('%prefix', prefix);
    if (msg.client.provider.getGuild(msg.guild.id, 'application').template.length === 0) return msg.channel.send(addentry);

    const reactionnumber = lang.application_reactionnumber.replace('%prefix', prefix);
    if (msg.client.provider.getGuild(msg.guild.id, 'application').reactionnumber === '') return msg.channel.send(reactionnumber);

    const undefinedmessages = lang.application_undefinedmessages.replace('%prefix', prefix).replace('%prefix', prefix);
    if (msg.client.provider.getGuild(msg.guild.id, 'application').acceptedmessage === '' || msg.client.provider.getGuild(msg.guild.id, 'application').rejectedmessage === '') return msg.channel.send(undefinedmessages);

    const newapplication = lang.application_newapplication.replace('%author', msg.author);
    msg.channel.send(newapplication);

    const array = [];

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'application').template.length; i += 1) {
      try {
        await msg.channel.send(`${msg.author}, ${msg.client.provider.getGuild(msg.guild.id, 'application').template[i]}`);
        const response = await msg.channel.awaitMessages((msg2) => msg2.attachments.size === 0 && msg.author.id === msg2.author.id && !msg2.author.bot, {
          max: 1,
          time: 600000,
          errors: ['time']
        });
        array.push(response.first().content);
        await response.first().delete();
      }
      catch (error) {
        const timeerror = lang.application_timeerror.replace('%prefix', prefix);
        return msg.channel.send(timeerror);
      }
    }

    const temparray = [];
    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'application').template.length; i += 1) {
      temparray.push(`${msg.client.provider.getGuild(msg.guild.id, 'application').template[i]} \n${array[i]}`);
    }

    const content = temparray.join('\n\n');

    const confs = {
      guildid: msg.guild.id,
      authorid: msg.author.id,
      applicationid: msg.client.provider.getGuild(msg.guild.id, 'application').applicationid + 1,
      date: msg.createdTimestamp,
      acceptedorrejected: '',
      status: 'open',
      content,
      yes: [],
      no: []
    };

    const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
    currentApplication.applicationid += 1;
    currentApplication.applications[msg.client.provider.getGuild(msg.guild.id, 'application').applicationid] = confs;
    await msg.client.provider.setGuild(msg.guild.id, 'application', currentApplication);

    await msg.channel.send(lang.application_applicatiosent);

    if (msg.client.provider.getGuild(msg.guild.id, 'application').notificationstatus === true) {
      const applicationembedanswer = lang.mainfile_applicationembed.replace('%ticketid', msg.client.provider.getGuild(msg.guild.id, 'application').applicationid);
      const embed = new Discord.MessageEmbed()
        .setURL(`https://lenoxbot.com/dashboard/${confs.guildid}/applications/${msg.client.provider.getGuild(msg.guild.id, 'application').applicationid}/overview`)
        .setTimestamp()
        .setColor('#ccffff')
        .setTitle(lang.mainfile_applicationembedtitle)
        .setDescription(applicationembedanswer);

      try {
        msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'application').notificationchannel).send({
          embed
        });
      }
      catch (error) {
        'undefined';
      }
    }
  }
};
