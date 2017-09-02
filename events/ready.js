exports.run = client => {
	console.log(`LENXOBOT: Ready to serve in ${client.channels.size} channels on ${client.guilds.size}, for a total of ${client.users.size} users.`);
	client.user.setPresence({ game: { name: `?help in ${client.guilds.size} guilds`, type: 0 } });
	client.user.setAvatar('https://cdn.discordapp.com/attachments/279953800377139201/353561487773663233/Unbenannt-10000.png');
};
