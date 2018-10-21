const settings = require('../../settings.json');
exports.run = (client, msg, args, lang) => {
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
	} catch (err) {
		msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'eval',
	description: 'Executes an eval code',
	usage: 'eval {command}',
	example: ['eval msg.channel.send(1);'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
