const Discord = require("discord.js");
exports.run = async(client, msg, args) => {
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
	aliases: []
};
exports.help = {
	name: 'eval',
	description: 'Executes an Eval command',
	usage: 'eval {command}',
	example: 'eval msg.channel.send(1);',
	category: 'botowner'
};
