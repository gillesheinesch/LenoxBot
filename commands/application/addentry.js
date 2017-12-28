const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.application) {
		tableload.application = {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: ''
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	let input = args.slice().join(' ');

	if (input.length < 1) return msg.reply('You have to decide which new entry you want to add to the template!').then(m => m.delete(10000));
	if (tableload.application.template.length >= 9) return msg.channel.send('There can only be 9 entries!');

		for (var i = 0; i < tableload.application.template.length; i++) {
			if (tableload.application.template[i].toLowerCase() === input.toLowerCase()) return msg.channel.send('This entry already exists in the template');
		}

		tableload.application.template.push(input);
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(`${input} was successfully added to the template`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'addentry',
	description: 'Inserts a new entry in the template',
	usage: 'addentry {new entry}',
	example: ['addentry How old are you?'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
