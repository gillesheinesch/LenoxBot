exports.run = async(client, msg, args) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	// if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel, please join a voice channel to skip music!');
	if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
	
	const map = client.skipvote;

	const mapload = map.get(msg.guild.id);
	if (mapload.users.includes(msg.author.id)) return msg.channel.send('You have already voted for this song!');

	mapload.users.push(msg.author.id);
	await map.set(msg.guild.id, mapload);

	const tableconfig = client.guildconfs.get(msg.guild.id);
	if (!tableconfig.skipnumber) {
		tableconfig.skipnumber = 1;
		await client.guildconfs.set(msg.guild.id, tableconfig);
	}

	if (mapload.users.length === 1) {
		msg.channel.send(`${msg.author} started a new quote to skip the current song! ${tableconfig.skipnumber} votes needed to skip the current music.`);
	}

	if (mapload.users.length > 1) {
		msg.channel.send(`${msg.author} also wants to skip the current music. ${mapload.users.length}/${tableconfig.skipnumber} votes to skip the current music.`);
	}

	const number = parseInt(tableconfig.skipnumber);

	if (mapload.users.length !== number) return undefined;

	msg.channel.send('The song has been skipped by the poll successfully');
	serverQueue.connection.dispatcher.end();
	return undefined;
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'skip',
	description: 'Allows the users to skip a song with a poll',
	usage: 'skip',
	example: 'skip',
	category: 'music'
};
