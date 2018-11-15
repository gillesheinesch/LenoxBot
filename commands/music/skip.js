exports.run = async (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	const tableconfig = client.guildconfs.get(msg.guild.id);

	if (tableconfig.skipvote === 'false') return msg.channel.send(lang.skip_skipvotedeativated);
	if (!msg.member.voiceChannel) return msg.channel.send(lang.skip_notvoicechannel);
	if (!serverQueue) return msg.channel.send(lang.skip_nothing);

	if (msg.member.voiceChannel.members.size === 2) {
		msg.channel.send(lang.skip_skippedalone);
		await serverQueue.connection.dispatcher.destroy();
		return;
	}

	const map = client.skipvote;

	const mapload = map.get(msg.guild.id);
	if (mapload.users.includes(msg.author.id)) return msg.channel.send(lang.skip_alreadyvoted);

	mapload.users.push(msg.author.id);
	await map.set(msg.guild.id, mapload);

	if (!tableconfig.skipnumber) {
		tableconfig.skipnumber = 1;
		client.guildconfs.set(msg.guild.id, tableconfig);
	}

	if (mapload.users.length === 1) {
		const newvote = lang.skip_newvote.replace('%author', msg.author).replace('%skipnumber', tableconfig.skipnumber);
		msg.channel.send(newvote);
	}

	if (mapload.users.length > 1) {
		const vote = lang.skip_vote.replace('%author', msg.author).replace('%currentvotes', mapload.users.length).replace('%skipnumber', tableconfig.skipnumber);
		msg.channel.send(vote);
	}

	const number = parseInt(tableconfig.skipnumber, 10);

	if (mapload.users.length !== number) return;

	msg.channel.send(lang.skip_skipped);
	await serverQueue.connection.dispatcher.destroy();
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Skip',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'skip',
	description: 'Allows the users to skip a song with a poll',
	usage: 'skip',
	example: ['skip'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES', 'SPEAK']
};
