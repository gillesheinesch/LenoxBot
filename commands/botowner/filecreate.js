exports.run = (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	var fs = require('fs');
	const tableload = client.guildconfs.get(msg.guild.id);
	const commandNames = Array.from(client.commands.keys());
	const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

	fs.writeFile(`gitbook/${args.join(" ")}.md`, `# ${args.join(" ")} commands\n\n| Command | Description | Required permissions |\n| :--- | :--- | :--- |\n|${client.commands.filter(c => c.help.category === args.join(" ").toLowerCase()).map(cmd => `${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} | ${cmd.help.description} | ${cmd.conf.userpermissions.length > 0 ? cmd.conf.userpermissions.join(", ") : 'any'}`).join("|\n|")}`, function (err) {
		console.log(`File created`);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['fc'],
	userpermissions: []
};

exports.help = {
	name: 'filecreate',
	description: 'You can submit a new proposal by using this command',
	usage: 'proposal {title of the proposal} | {description}',
	example: ['proposal ping command | I want to have a ping command'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
