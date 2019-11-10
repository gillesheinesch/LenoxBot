const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class bashCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'bash',
      group: 'botowner',
      memberName: 'bash',
      description: 'Discord',
      format: 'bash {code}',
      aliases: ['exec'],
      examples: ['bash git help'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);
    const code = args.join(' ');

    if (!code) return msg.channel.send(lang.bash_error);

    const { exec } = require('child_process');
    exec(code, (err, stdout, stderr) => {
      if (err) {
        msg.channel.send(err, {
          code: 'xl'
        });
      }
      if (stderr) {
        msg.channel.send(stderr, {
          code: 'xl'
        });
      }
      if (stdout) {
        msg.channel.send(stdout, {
          code: 'xl'
        });
      }
      if (!stderr && !stdout) msg.channel.send(lang.bash_done);
    });
  }
};
