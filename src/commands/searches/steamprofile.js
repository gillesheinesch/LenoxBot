const Discord = require('discord.js');
const SteamRepAPI = require('steamrep');
const ms = require('ms');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class steamprofileCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'steamprofile',
      group: 'searches',
      memberName: 'steamprofile',
      description: 'Requests Steam profile informations of a Steamuser',
      format: 'steamprofile {SteamID64}',
      aliases: ['sp'],
      examples: ['steamprofile 76561198150711701'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Steam',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (args.slice().length < 1) return msg.channel.send(lang.steamprofile_validsteamid);
    if (isNaN(args.slice().join(''))) return msg.channel.send(lang.steamprofile_nosteamid);

    const id = args.slice();
    SteamRepAPI.timeout = 5000;
    SteamRepAPI.getProfile(id[0], (error, result) => {
      if (result.steamrep.flags.status !== 'notfound') {
        const embed = new Discord.MessageEmbed()
          .setImage(result.steamrep.avatar)
          .setColor('#336600')
          .addField('SteamID64', result.steamrep.steamID64, true)
          .addField(lang.steamprofile_rep, result.steamrep.reputation.summary)
          .addField(lang.steamprofile_tban, result.steamrep.tradeban, true)
          .addField(lang.steamprofile_vban, result.steamrep.vacban, true)
          .addField(lang.steamprofile_membersince, `${ms(result.steamrep.membersince * 1000, { long: true })} (${new Date(result.steamrep.membersince * 1000).toUTCString()})`)
          .setAuthor(result.steamrep.displayname, result.steamrep.avatar);

        if (result.steamrep.customurl !== '') {
          embed.setURL(`http://steamcommunity.com/id/${result.steamrep.customurl}`);
        }
        return msg.channel.send({ embed });
      }
		 msg.channel.send(lang.steamprofile_error);
    });
  }
};
