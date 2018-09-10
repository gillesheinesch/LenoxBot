exports.run = (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	const code = args.join(' ');
	if (!code) return args.channel.send(lang.bash_error);

	const {
		exec
	} = require('child_process');
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
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: ['exec'],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'bash',
	description: 'Discord',
	usage: 'bash {code}',
	example: ['bash git help'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
