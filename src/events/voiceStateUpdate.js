module.exports = {
  run: async (oldState, newState) => {
	  if (!client.provider.isReady) return;
	  const { queue } = client;
	  const serverQueue = queue.get(newState.guild.id);
	  if (!serverQueue) return;
	  if (!oldState.channel) return;

	  if (oldState.channel.members.size === 1) {
	  serverQueue.songs = [];
      await serverQueue.connection.dispatcher.end();
	  }
  }
};
