exports.run = async(client, msg, args) => {
		const message = await msg.channel.send('Hmm...Ping?');
	message.edit(`Here we go! It took ${message.createdTimestamp - msg.createdTimestamp}ms to send this message!`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: []
};

exports.help = {
	name: 'ping',
	description: 'Shows you how long the bot needs to send a message',
	usage: 'ping',
	example: ['ping'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
