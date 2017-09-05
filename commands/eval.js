exports.run = async (client, msg, args) => {
	const clean = text => {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
				return text;
	}
	try {
		const code = args.join(" ");
		let evaled = eval(code);

		if (typeof evaled !== "string")
			evaled = require("util").inspect(evaled);

		msg.channel.send(clean(evaled), {code:"xl"});
	} catch (err) {
		msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
}
	exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['cmds']
};
exports.help = {
	name: 'eval',
	description: 'All commands of a module',
	usage: 'commands {Modulename}',
	example: 'commands Help',
	category: 'help'
};