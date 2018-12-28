const englishLang = require(`../languages/en-US.json`);
exports.run = async (client, msg) => {
	if (msg.author.bot) return;
	if (msg.channel.type !== 'text') return msg.reply(englishLang.messageevent_error);

	const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
	const lang = require(`../languages/${langSet}.json`);

	if (msg.client.provider.getGuild(msg.guild.id, 'modules').utility === 'true') {
		if (!msg.client.provider.getGuild(msg.guild.id, 'togglexp').channelids.includes(msg.channel.id)) {
			const currentScores = client.provider.getGuild(msg.guild.id, 'scores');
			if (currentScores[msg.author.id]) {
				currentScores[msg.author.id].points += 1;
			} else {
				currentScores[msg.author.id] = {
					points: 0,
					level: 0
				};
			}

			const curLevel = Math.floor(0.3 * Math.sqrt(currentScores[msg.author.id].points + 1));
			if (curLevel > currentScores[msg.author.id].level) {
				currentScores[msg.author.id].level = curLevel;

				if (client.provider.getGuild(msg.guild.id, 'xpmessages') === 'true') {
					const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', currentScores[msg.author.id].level);
					msg.channel.send(levelup);
				}
			}
			if (curLevel < currentScores[msg.author.id].level) {
				currentScores[msg.author.id].level = curLevel;

				if (client.provider.getGuild(msg.guild.id, 'xpmessages') === 'true') {
					const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', currentScores[msg.author.id].level);
					msg.channel.send(levelup);
				}
			}

			for (let i = 1; i < client.provider.getGuild(msg.guild.id, 'ara').length; i += 2) {
				if (client.provider.getGuild(msg.guild.id, 'ara').ara[i] < currentScores[msg.author.id].points && !msg.member.roles.get(client.provider.getGuild(msg.guild.id, 'ara')[i - 1])) {
					const role = msg.guild.roles.get(client.provider.getGuild(msg.guild.id, 'ara')[i - 1]);
					msg.member.addRole(role);

					const automaticrolegotten = lang.messageevent_automaticrolegotten.replace('%rolename', role.name);
					msg.channel.send(automaticrolegotten);
				}
			}
			await client.provider.setGuild(msg.guild.id, 'scores', currentScores);
		}
	}
};
