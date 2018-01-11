exports.run = (client, msg, args, lang) => {
	if (msg.guild.id !== '352896116812939264') return msg.channel.send(lang.proposal_error);
	if (msg.author.bot) return;
		let proposal = args.slice();

		if (!proposal) return msg.channel.send('You did not enter a proposal!');
		if (!proposal.includes("|")) return msg.channel.send('You have to set a title for your proposal! Please read out <#353635000702337025> one more time!');
		if (proposal.length < 5) return msg.channel.send('Your suggestion is too short. Try to give him some more detail!');

			msg.channel.send(`${msg.author}, Your proposal was submitted successfully and we will notify you as soon as possible.`);
			let files = '';
			if (msg.attachments.size > 0) {
				files = msg.attachments.first().url;
			}
			client.channels.get('372404583005290508').send(`${proposal.join(" ") + ' ' + files} \nProposal by the following user: ${msg.author.tag}`).then(m => { 
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
	name: 'proposal',
	description: 'You can submit a new proposal by using this command',
	usage: 'proposal {title of the proposal} | {description}',
	example: ['proposal ping command | I want to have a ping command'],
	category: 'trello',
    botpermissions: ['SEND_MESSAGES']
};
