const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class evalCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'eval',
      group: 'botowner',
      memberName: 'eval',
      description: 'Executes an eval code',
      format: 'eval {command}',
      aliases: [],
      examples: ['eval msg.channel.send(1);'],
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

    function clean(text) {
      if (typeof (text) === 'string') {
        return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
      }
      return text;
    }

    try {
      const code = args.join(' ');
      /* eslint no-eval: 0 */
      let evaled = eval(code);

      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled);
      }

      msg.channel.send(clean(evaled), {
        code: 'xl'
      });
    }
    catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};
