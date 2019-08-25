const LenoxCommand = require('../LenoxCommand.js');

module.exports = class activatemoduleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'activatemodule',
      group: 'administration',
      memberName: 'activatemodule',
      description: 'Activates a module and its commands on a Discord server',
      format: 'activatemodule {name of the module}',
      aliases: ['am'],
      examples: ['activatemodule help'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Modules',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const moduleactivated = lang.activatemodule_moduleactivated.replace('%modulename', args.slice());
    if (args.slice().length === 0) return msg.channel.send(lang.activatemodule_noinput);
    const margs = msg.content.split(' ');
    const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'moderation', 'application', 'currency', 'partner', 'tickets', 'customcommands'];

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'administration') {
          return msg.channel.send(lang.activatemodule_administration);
        } if (margs[1].toLowerCase() === 'partner') {
          return msg.channel.send(lang.activatemodule_partner);
        } if (margs[1].toLowerCase() === 'utility') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').utility === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.utility = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'music') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').music === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.music = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'fun') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').fun === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.fun = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'help') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').help === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.help = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'searches') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').searches === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.searches = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'nsfw') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').nsfw === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.nsfw = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'moderation') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').moderation === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.moderation = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'application') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').application === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.application = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'currency') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').currency === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.currency = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'customcommands') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').customcommands === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.customcommands = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        } if (margs[1].toLowerCase() === 'tickets') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').tickets === 'true') return msg.channel.send(lang.activatemodule_alreadyactivated);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.tickets = 'true';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduleactivated);
        }
      }
    }
    return msg.channel.send(lang.activatemodule_error);
  }
};
