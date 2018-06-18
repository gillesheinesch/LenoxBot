exports.run = async (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
    const code = args.join(' ');
    if (!code) return args.channel.send('❌ You must include a code!');
  
    const { exec } = require('child_process');
    exec(code, (err, stdout, stderr) => {
      if (err) msg.channel.send(err, { code: 'xl' });
      if (stderr) msg.channel.send(stderr, { code: 'xl' });
      if (stdout) msg.channel.send(stdout, { code: 'xl' });
      if (!stderr && !stdout) msg.channel.send('✅ Done (no output)');
    });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['exec'],



  userpermissions: [], dashboardsettings: true

};
exports.help = {
	name: 'bash',
	description: 'Discord',
	usage: 'bash {command}',
	example: ['bash git help'],
	category: 'botowner',
  botpermissions: ['SEND_MESSAGES']
};
