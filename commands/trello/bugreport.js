exports.run = (client, msg, args) => {
    if (msg.guild.id !== '352896116812939264') return msg.channel.send('You have to use this command on the official LenoxBot Server: https://discord.gg/5mpwCr8');
	if (msg.author.bot) return;
		let bewerbung = args.slice();

		if (!bewerbung) return msg.channel.send('You did not enter a bugreport!');
		if (!bewerbung.includes("|")) return msg.channel.send('You have to set a title for your bugreport! Please read out <#353635000702337025> one more time!');
		if (bewerbung.length < 5) return msg.channel.send('Your bugreport is too short. Try to give him some more detail!');

			msg.channel.send(`${msg.author}, Your bugreport was submitted successfully and we will notify you as soon as possible.`);
			let files;
			if (msg.attachments.size > 0) {
				files = msg.attachments.first().url;
			}
			client.channels.get('372404616001880064').send(`${bewerbung.join(" ")} \nBugreport by the following user: ${msg.author.tag}`, { files, disableEveryone: true }).then(m => { 
				m.react('👍'); m.react('👎');
			});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};

exports.help = {
	name: 'bugreport',
	description: 'You can submit a new bugreport by using this command',
	usage: 'bugreport {title of the bugreport} | {description}',
	example: ['bugreport ping command bug | There is just written ping but not how many ms this message needed to send'],
	category: 'trello',
    botpermissions: ['SEND_MESSAGES']
};
