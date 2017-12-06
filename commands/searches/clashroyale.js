const Discord = require('discord.js');
exports.run = async (client, msg, args) => {
	const api = require('clashroyale');
	const validation = ['clan', 'profile'];
	const margs = msg.content.split(" ");

	if (!args[0] && !args[1]) return msg.channel.send('You have to enter if you want to search for a profile/clan. Then you have to enter the ID of the clan or the profile.');

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "profile") {
				try {
					var profileResult = await api.getProfile(args[1]);
					var array = [];
					profileResult.currentDeck.forEach(function(x){
						array.push(x.name);
					});
					const embed = new Discord.RichEmbed()
					.setAuthor(`${profileResult.name} (#${profileResult.tag})`)
					.setFooter('ClashRoyale Profile Stats')
					.setThumbnail('https://cdn.discordapp.com/attachments/353085017687064576/375975148341166080/oBvObTIz.png')
					.setColor('#f45942')
					.addField('Profile', `Level: ${profileResult.experience.level} \nMax Trophies: ${profileResult.stats.maxTrophies} \nGames played: ${profileResult.games.total} (${profileResult.games.wins} W/${profileResult.games.losses} L/${profileResult.games.draws} D)`)
					.addField(`Arena`, `${profileResult.arena.arena} (${profileResult.arena.name})`)
					.addField('Clan', `Name: ${profileResult.clan.name} \nRole: ${profileResult.clan.role}`)
					.addField('Current Deck', `${array.join(', ')}`);
					return msg.channel.send({ embed });
				} catch (error) {
					return msg.channel.send('Could not find the Clash Royale profile. Please make sure you have entered the ID of your profile!');
				}
		} else if (margs[1].toLowerCase() == "clan") {
			try {
				var clanResult = await api.getClan(args[1]);
				var clanArray = [];
				clanResult.members.forEach(function(x){
					clanArray.push(x.name);
				});

				const embed = new Discord.RichEmbed()
				.setAuthor(`${clanResult.name} (#${clanResult.tag})`)
				.setFooter('ClashRoyale Clan Stats')
				.setThumbnail('https://cdn.discordapp.com/attachments/353085017687064576/375975148400017408/Clan-Battle.png')
				.setColor('#56bf88')
				.addField('Clan', `Description: ${clanResult.description} \nType: ${clanResult.typeName}\nMembercount: ${clanResult.memberCount} \nScore: ${clanResult.score} \nDonations: ${clanResult.donations}`)
				.addField(`Clanchest`, `Crowns: ${clanResult.clanChest.clanChestCrowns}/${clanResult.clanChest.clanChestCrownsRequired} \nCrowns Percent ${clanResult.clanChest.clanChestCrownsPercent} % \n`)
				.addField('All members', `${clanArray.join(', ')}`);
				return msg.channel.send({ embed });
				
			} catch (error) {
				return msg.channel.send('Could not find the Clash Royale clan. Please make sure you have the ID of your clan!');
			}
		}
		}
	} 
	const tableload = client.guildconfs.get(msg.guild.id);
	msg.channel.send(`It looks like you were looking for something invalid. You have the choice of having statistics displayed by a Clash Royale \`profile\` or \`clan\`! For more help: ${tableload.prefix}help clashroyale`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['cr'],
    userpermissions: []
};
exports.help = {
	name: 'clashroyale',
	description: 'Shows you ClashRoyale stats about a player or a clan',
	usage: 'clashroyale {profile or clan}',
	example: ['clashroyale clan 2QLU0LYJ'],
	category: 'searches',
    botpermissions: ['SEND_MESSAGES']
};
