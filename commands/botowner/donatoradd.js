const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');

	var content = args.slice();

	if (!client.botconfs.get('donators')) {
		client.botconfs.set('donators', {
			donators: []
		});		
	}

	const tableload = client.botconfs.get('donators');

	if (content.length > 1) return msg.channel.send('The donator\'s name mustn\'t contain any spaces!').then(m => m.delete(10000));


	tableload.donators.push(args);
	await client.botconfs.set('donators', tableload);
	const embed = new Discord.RichEmbed()
	.setColor('#77f442')
	.setDescription('A new donator was added to the donators list!');
	msg.channel.send({ embed }).then(m => m.delete(10000));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'donatoradd',
	description: 'translator',
	usage: 'donatoradd',
	example: ['donatoradd'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};

