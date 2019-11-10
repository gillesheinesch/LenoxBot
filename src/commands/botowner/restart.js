const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class restartCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'restart',
      group: 'botowner',
      memberName: 'restart',
      description: 'Restarts the bot',
      format: 'restart {reason}',
      aliases: ['reboot'],
      examples: ['restart Lagging'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true,
      cooldown: 60000
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (!settings.owners.includes(msg.author.id) && !settings.administrators.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

    if (!args || args.length === 0) {
      const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
      delete timestamps.restart[msg.author.id];
      await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);

      return msg.reply(lang.restart_noreason);
    }

    await msg.channel.send(lang.restart_message);

    const restartEmbed = new Discord.MessageEmbed()
      .setTitle(lang.restart_embedtitle)
      .addField(lang.restart_embedfield, args.join(' '))
      .setColor('RED')
      .setTimestamp()
      .setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL());

    if (msg.client.user.id === '354712333853130752') {
      await msg.client.channels.get('497400107109580801').send({
        embed: restartEmbed
      });
    }

    process.exit(42);
  }
};
