exports.run = (client, msg, args) => {
	if (msg.guild.id !== '352896116812939264') return msg.channel.send('You have to use this command on the official LenoxBot Server: https://discord.gg/5mpwCr8');
	if (msg.author.bot) return;
		let bewerbung = args.slice();

		if (!bewerbung) return msg.channel.send('You did not enter a proposal!');
		if (!bewerbung.includes("|")) return msg.channel.send('You have to set a title for your proposal! Please read out <#353635000702337025> one more time!');
		if (bewerbung.length < 5) return msg.channel.send('Your suggestion is too short. Try to give him some more detail!');

			msg.channel.send(`${msg.author}, Your proposal was submitted successfully and we will notify you as soon as possible.`).then(m => m.delete(10000));
			let files;
			if (msg.attachments.size) {
				files = msg.attachments.first().url;
			}
			client.channels.get('372404583005290508').send(`${bewerbung.join(" ")} \nProposal by the following user: ${msg.author.tag}`, { files, disableEveryone: true }).then(m => { 
				m.react('👍'); m.react('👎');
			});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};

exports.help = {
	name: 'proposal',
	description: 'You can submit a new proposal by using this command',
	usage: 'proposal {title of the proposal} | {description}',
	example: 'proposal ping command | I want to have a ping command',
	category: 'trello'
};
