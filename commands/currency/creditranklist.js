const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class creditranklistCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'creditranklist',
			group: 'currency',
			memberName: 'creditranklist',
			description: 'Ranking, sorted by the credits',
			format: 'creditranklist',
			aliases: ['richest'],
			examples: ['creditranklist'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'Credits',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		let userArray = [];
		await msg.client.provider.getDatabase().collection('userSettings').find()
			.forEach(row => {
				if (!isNaN(row.settings.credits)) {
					const member = msg.client.users.get(row.userId);
					const settings = {
						userId: row.userId,
						user: member ? member.tag : row.userId,
						credits: Number(row.settings.credits)
					};
					if (settings.userId !== 'global') {
						userArray.push(settings);
					}
				}
			});

		userArray = userArray.sort((a, b) => {
			if (a.credits < b.credits) {
				return 1;
			}
			if (a.credits > b.credits) {
				return -1;
			}
			return 0;
		});

		for (let i = 0; i < userArray.length; i++) {
			userArray[i].final = `${i + 1}. ${userArray[i].user}`;
		}

		const embedFinalName = [];
		const embedCredits = [];
		Object.entries(userArray).slice(0, 20).map(obj => {
			embedFinalName.push(obj[1].final);
			embedCredits.push(obj[1].credits);
		});

		const embed = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#009933')
			.addField(lang.creditranklist_name, embedFinalName.join('\n'), true)
			.addField(lang.creditranklist_credits, embedCredits.join('\n'), true);

		msg.channel.send({ embed });
	}
};
