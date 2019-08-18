const SteamRepAPI = require('steamrep');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class steamscammercheckCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'steamscammercheck',
      group: 'searches',
      memberName: 'steamscammercheck',
      description: 'Checks whether a Steam user was marked as scammer',
      format: 'steamscammercheck {SteamID64}',
      aliases: ['ssc'],
      examples: ['steamscammercheck 76561198150711701'],
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

    if (args.slice().length < 1) return msg.channel.send(lang.steamscammercheck_validsteamid);
    if (isNaN(args.slice().join(''))) return msg.channel.send(lang.steamscammercheck_nosteamid);

    const id = args.slice();
    SteamRepAPI.timeout = 5000;
    SteamRepAPI.isScammer(id[0], (error, result) => {
      if (error) {
        return msg.channel.send(lang.steamscammercheck_error);
      }
      if (result) {
        const scammer = lang.steamscammercheck_scammer.replace('%author', msg.author);
        return msg.channel.send(scammer);
      }
      const notscammer = lang.steamscammercheck_notscammer.replace('%author', msg.author);
      return msg.channel.send(notscammer);
    });
  }
};
