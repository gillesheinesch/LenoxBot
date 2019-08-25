const LenoxCommand = require('../LenoxCommand.js');

module.exports = class logCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'log',
      group: 'administration',
      memberName: 'log',
      description: 'Allows you to log for different channels, different events. Use ?listevents to get a list of all events',
      format: 'log {name of the event}',
      aliases: [],
      examples: ['log modlog'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Events',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');
    const args = msg.content.split(' ').slice(1);

    const validation = ['chatfilter', 'modlog', 'messagedelete', 'messageupdate', 'channelupdate', 'channelcreate', 'channeldelete', 'memberupdate', 'presenceupdate', 'userjoin', 'userleft', 'rolecreate', 'roledelete', 'roleupdate', 'guildupdate'];
    const content = args.slice().join(' ');
    const margs = msg.content.split(' ');

    const noinput = lang.log_noinput.replace('%prefix', prefix);
    if (!content) return msg.channel.send(noinput);

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'messagedelete') {
          if (msg.client.provider.getGuild(msg.guild.id, 'messagedellog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'messagedellogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'messagedellog', 'true');

            const messagedeleteset = lang.log_messagedeleteset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(messagedeleteset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'messagedellog', 'false');

          return msg.channel.send(lang.log_messagedeletedeleted);
        } if (margs[1].toLowerCase() === 'messageupdate') {
          if (msg.client.provider.getGuild(msg.guild.id, 'messageupdatelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'messageupdatelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'messageupdatelog', 'true');

            const messageupdateset = lang.log_messageupdateset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(messageupdateset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'messageupdatelog', 'false');

          return msg.channel.send(lang.log_messageupdatedeleted);
        } if (margs[1].toLowerCase() === 'channelupdate') {
          if (msg.client.provider.getGuild(msg.guild.id, 'channelupdatelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'channelupdatelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'channelupdatelog', 'true');

            const channelupdateset = lang.log_channelupdateset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(channelupdateset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'channelupdatelog', 'false');

          return msg.channel.send(lang.log_channelupdatedeleted);
        } if (margs[1].toLowerCase() === 'memberupdate') {
          if (msg.client.provider.getGuild(msg.guild.id, 'guildmemberupdatelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'guildmemberupdatelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'guildmemberupdatelog', 'true');

            const memberupdateset = lang.log_memberupdateset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(memberupdateset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'guildmemberupdatelog', 'false');

          return msg.channel.send(lang.log_memberupdatedeleted);
        } if (margs[1].toLowerCase() === 'channelcreate') {
          if (msg.client.provider.getGuild(msg.guild.id, 'channelcreatelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'channelcreatelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'channelcreatelog', 'true');

            const channelcreateset = lang.log_channelcreateset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(channelcreateset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'channelcreatelog', 'false');

          return msg.channel.send(lang.log_channelcreatedeleted);
        } if (margs[1].toLowerCase() === 'channeldelete') {
          if (msg.client.provider.getGuild(msg.guild.id, 'channeldeletelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'channeldeletelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'channeldeletelog', 'true');

            const channeldeleteset = lang.log_channeldeleteset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(channeldeleteset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'channeldeletelog', 'false');

          return msg.channel.send(lang.log_channeldeletedeleted);
        } if (margs[1].toLowerCase() === 'userjoin') {
          if (msg.client.provider.getGuild(msg.guild.id, 'welcomelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'welcomelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'welcomelog', 'true');

            const userjoinset = lang.log_userjoinset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(userjoinset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'welcomelog', 'false');

          return msg.channel.send(lang.log_userjoindeleted);
        } if (margs[1].toLowerCase() === 'userleft') {
          if (msg.client.provider.getGuild(msg.guild.id, 'byelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'byelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'byelog', 'true');

            const userleftset = lang.log_userleftset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(userleftset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'byelog', 'false');

          return msg.channel.send(lang.log_userleftdeleted);
        } if (margs[1].toLowerCase() === 'modlog') {
          if (msg.client.provider.getGuild(msg.guild.id, 'modlog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'modlogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'modlog', 'true');

            const modlogset = lang.log_modlogset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(modlogset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'modlog', 'false');

          return msg.channel.send(lang.log_modlogdeleted);
        } if (margs[1].toLowerCase() === 'rolecreate') {
          if (msg.client.provider.getGuild(msg.guild.id, 'rolecreatelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'rolecreatelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'rolecreatelog', 'true');

            const rolecreateset = lang.log_rolecreateset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(rolecreateset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'rolecreatelog', 'false');

          return msg.channel.send(lang.log_rolecreatedeleted);
        } if (margs[1].toLowerCase() === 'roledelete') {
          if (msg.client.provider.getGuild(msg.guild.id, 'roledeletelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'roledeletelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'roledeletelog', 'true');

            const roledeleteset = lang.log_roledeleteset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(roledeleteset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'roledeletelog', 'false');

          return msg.channel.send(lang.log_roledeletedeleted);
        } if (margs[1].toLowerCase() === 'roleupdate') {
          if (msg.client.provider.getGuild(msg.guild.id, 'roleupdatelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'roleupdatelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'roleupdatelog', 'true');

            const roleupdateset = lang.log_roleupdateset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(roleupdateset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'roleupdatelog', 'false');

          return msg.channel.send(lang.log_roleupdatedeleted);
        } if (margs[1].toLowerCase() === 'presenceupdate') {
          if (msg.client.provider.getGuild(msg.guild.id, 'presenceupdatelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'presenceupdatelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'presenceupdatelog', 'true');

            const presenceupdateset = lang.log_presenceupdateset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(presenceupdateset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'presenceupdatelog', 'false');

          return msg.channel.send(lang.log_presenceupdatedeleted);
        } if (margs[1].toLowerCase() === 'guildupdate') {
          if (msg.client.provider.getGuild(msg.guild.id, 'guildupdatelog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'guildupdatelogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'guildupdatelog', 'true');

            const guildupdateset = lang.log_guildupdateset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(guildupdateset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'guildupdatelog', 'false');

          return msg.channel.send(lang.log_guildupdatedeleted);
        } if (margs[1].toLowerCase() === 'chatfilter') {
          if (msg.client.provider.getGuild(msg.guild.id, 'chatfilterlog') === 'false') {
            await msg.client.provider.setGuild(msg.guild.id, 'chatfilterlogchannel', msg.channel.id);
            await msg.client.provider.setGuild(msg.guild.id, 'chatfilterlog', 'true');

            const chatfilterset = lang.log_chatfilterset.replace('%channelname', `**#${msg.channel.name}**`);
            return msg.channel.send(chatfilterset);
          }
          await msg.client.provider.setGuild(msg.guild.id, 'chatfilterlog', 'false');

          return msg.channel.send(lang.log_chatfilterdeleted);
        }
      }
    }
    const error = lang.log_error.replace('%prefix', prefix);
    msg.channel.send(error);
  }
};
