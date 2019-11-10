const LenoxCommand = require('../LenoxCommand.js');

module.exports = class deactivatemoduleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'deactivatemodule',
      group: 'administration',
      memberName: 'deactivatemodule',
      description: 'Disables a module and its commands on a Discord server',
      format: 'deactivatemodule {name of the module}',
      aliases: ['dm'],
      examples: ['deactivatemodule help'],
      category: 'administration',
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

    const moduledeactivated = lang.deactivatemodule_moduledisabled.replace('%modulename', args.slice());
    if (args.slice().length === 0) return msg.channel.send(lang.deactivatemodule_noinput);
    const margs = msg.content.split(' ');
    const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'moderation', 'application', 'currency', 'partner', 'tickets', 'customcommands'];

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'administration') {
          return msg.channel.send(lang.deactivatemodule_administration);
        } if (margs[1].toLowerCase() === 'partner') {
          return msg.channel.send(lang.deactivatemodule_partner);
        } if (margs[1].toLowerCase() === 'utility') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').utility === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.utility = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'music') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').music === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.music = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'fun') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').fun === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.fun = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'help') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').help === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.help = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'searches') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').searches === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.searches = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'nsfw') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').nsfw === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.nsfw = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'moderation') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').moderation === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.moderation = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'application') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').application === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.application = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'currency') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').currency === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.currency = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'customcommands') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').customcommands === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.customcommands = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        } if (margs[1].toLowerCase() === 'tickets') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modules').tickets === 'false') return msg.channel.send(lang.deactivatemodule_alreadydisabled);

          const currentModules = msg.client.provider.getGuild(msg.guild.id, 'modules');
          currentModules.tickets = 'false';
          await msg.client.provider.setGuild(msg.guild.id, 'modules', currentModules);

          return msg.channel.send(moduledeactivated);
        }
      }
    }
    msg.channel.send(lang.deactivatemodule_error);
  }
};
