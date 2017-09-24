exports.run = (client, oldMember, newMember) => {
	const queue = client.queue;
	const serverQueue = queue.get(newMember.guild.id);
	if (!serverQueue) return;
	if (!oldMember.voiceChannel) return;
	if (newMember.voiceChannel.members.size === 1) {
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	}
};
