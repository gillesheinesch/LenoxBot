const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const keygenerator = require('../../utils/keygenerator.js');

module.exports = class ticketCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'ticket',
      group: 'tickets',
      memberName: 'ticket',
      description: 'Creates a new ticket',
      format: 'ticket {text}',
      aliases: [],
      examples: ['ticket Hello how can I open Discord?'],
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

    if (!args || args.length === 0) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.ticket[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
      return msg.reply(lang.ticket_noinput);
    }

    const input = args.slice();

    let key = '';
    for (let i = 0; i < 1000; i += 1) {
      key = keygenerator.generateKey();

      if (!msg.client.provider.getBotsettings('botconfs', 'ticketids').includes(key)) {
        break;
      }

      if (i === 999) {
        key = undefined;
      }
    }
    if (key !== undefined) {
      const currentTicketids = msg.client.provider.getBotsettings('botconfs', 'ticketids');
      currentTicketids.push(key);
      await msg.client.provider.setBotsettings('botconfs', 'ticketids', currentTicketids);
    }

    const confs = {
      guildid: msg.guild.id,
      authorid: msg.author.id,
      ticketid: key,
      date: msg.createdTimestamp,
      users: [],
      status: 'open',
      content: input.join(' '),
      answers: {}
    };

    const currentTickets = msg.client.provider.getBotsettings('botconfs', 'tickets');
    currentTickets[key] = confs;
    await msg.client.provider.setBotsettings('botconfs', 'tickets', currentTickets);

    const ticket = msg.client.provider.getBotsettings('botconfs', 'tickets')[key];

    if (msg.client.provider.getGuild(msg.guild.id, 'tickets').notificationstatus === true) {
      const ticketembed = lang.mainfile_ticketembed.replace('%ticketid', ticket.ticketid);
      const embed = new Discord.MessageEmbed()
        .setURL(`https://lenoxbot.com/dashboard/${ticket.guildid}/tickets/${key}/overview`)
        .setTimestamp()
        .setColor('#66ff33')
        .setTitle(lang.mainfile_ticketembedtitle)
        .setDescription(ticketembed);

      if (msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'tickets').notificationchannel)) {
        msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'tickets').notificationchannel).send({
          embed
        });
      }
    }

    const created = lang.ticket_created.replace('%link', `https://lenoxbot.com/tickets/${key}/overview`);
    return msg.reply(created);
  }
};
