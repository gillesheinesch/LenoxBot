exports.run = client => {
	console.log(`LENXOBOT: Ready to serve in ${client.channels.size} channels on ${client.guilds.size}, for a total of ${client.users.size} users.`);
	client.user.setPresence({ game: { name: `?help in ${client.guilds.size} guilds`, type: 0 } });
	console.log(client.guilds.map(g => g.id));
};
