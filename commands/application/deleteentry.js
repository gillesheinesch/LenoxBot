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

	if (input.length < 1) return msg.reply('You have to decide which entry you want to remove from the template!').then(m => m.delete(10000));

	for (var i = 0; i < tableload.application.template.length; i++) {
		if (input.toLowerCase() === tableload.application.template[i].toLowerCase()) {
				for (var i = 0; i < tableload.application.template.length; i++) {
					if (input.toLowerCase() === tableload.application.template[i].toLowerCase()) {
						tableload.application.template.splice(i, 1);
						await client.guildconfs.set(msg.guild.id, tableload);
					}
				}
				await client.guildconfs.set(msg.guild.id, tableload);
		
				return msg.channel.send(`${input} was successfully removed from the template`);
		} 
	}
	return msg.channel.send('This entry does not exist in the template');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'deleteentry',
	description: 'Deletes an entry from the template',
	usage: 'deleteentry {entry}',
	example: ['deleteentry How old are you?'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
