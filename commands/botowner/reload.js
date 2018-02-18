exports.run = async (client, msg, args, lang) => {
	const fs = require('fs');
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	const categories = ['currency', 'botowner', 'administration', 'moderation', 'fun', 'help', 'music', 'nsfw', 'searches', 'trello', 'utility', 'staff', 'application', 'partner'];

	categories.forEach((c, i) => {
		fs.readdir(`./commands/${c}/`, (err, files) => {
			if (err) throw err;

			files.forEach((f) => {
				let props = require(`../${c}/${f}`);
				delete require.cache[require.resolve(`../${c}/${f}`)];
				client.commands.set(props.help.name, props);
				props.conf.aliases.forEach(alias => {
					client.aliases.set(alias, props.help.name);
				});
			});
		});
	});


	msg.reply(`The commands have been reloaded!`).then(m => m.delete(10000));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'reload',
	description: 'Discord',
	usage: 'reload {command}',
	example: ['reload ping'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};