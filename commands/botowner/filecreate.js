exports.run = (client, msg, args) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');	
	var createFile = require('create-file');
	const tableload = client.guildconfs.get(msg.guild.id);
	const commandNames = Array.from(client.commands.keys());
	const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

	createFile(`${args.join(" ")}.md`, `# ${args.join(" ")} commands\n\n| Command | Description |\n| :--- | :--- |\n|${client.commands.filter(c => c.help.category === args.join(" ").toLowerCase()).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} | ${cmd.help.description}`).join("|\n|")}`, function (err) {
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
	example: 'proposal ping command | I want to have a ping command',
	category: 'trello',
	botpermissions: ['SEND_MESSAGES']
};
