module.exports = {
	run: async (oldMember, newMember) => {
		if (!client.provider.isReady) return;
		const queue = client.queue;
		const serverQueue = queue.get(newMember.guild.id);
		if (!serverQueue) return;
		if (!oldMember.voice.channel) return;

		if (oldMember.voice.channel.members.size === 1) {
			serverQueue.songs = [];
			await serverQueue.connection.dispatcher.destroy();
		}
	}
};
