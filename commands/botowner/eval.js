const Discord = require("discord.js");
exports.run = async(client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	try {
		const code = args.join(" ");
		let evaled = eval(code);

		if (typeof evaled !== "string")
			evaled = require("util").inspect(evaled);

		msg.channel.send(clean(evaled), {
			code: "xl"
		});
	} catch (err) {
		msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
};

function clean(text) {
	if (typeof (text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}
exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'eval',
	description: 'Executes an Eval command',
	usage: 'eval {command}',
	example: ['eval msg.channel.send(1);'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
