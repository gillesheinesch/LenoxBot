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

	const number = args.slice();

	if (number.length === 0) return msg.channel.send(`Currently ${tableload.application.reactionnumber} is required to accept or decline an application!`);
	if (number.length > 1) return msg.channel.send('Your new reactioncount can not contain spaces');
	if (isNaN(number)) return msg.channel.send('You forgot to indicate which new reaction number you want');
	if (number < 2) return msg.channel.send(`The number of reactions can not be 1 or less`);

	tableload.application.reactionnumber = number;
	await client.guildconfs.set(msg.guild.id, tableload);
	
	msg.channel.send(`The number of responses to accept or decline an application has been changed to ${number}`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'reactionnumber',
	description: 'Defines the number of reactions required to accept or reject an application',
	usage: 'reactionnumber {number}',
	example: ['reactionnumber 2'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
