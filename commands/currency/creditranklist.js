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
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Credits',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		let userArray = [];
		const array = await msg.client.provider.getDatabase().collection('userSettings').aggregate([{ $sort: { 'settings.credits': -1 } }, { $limit: 20 }])
			.toArray();

		for (const row of array) {
			if (!isNaN(row.settings.credits)) {
				const member = await msg.client.fetchUser(row.userId);
				const settings = {
					userId: row.userId,
					user: member ? member.tag : row.userId,
					credits: Number(row.settings.credits)
				};
				if (row.userId !== 'global') {
					userArray.push(settings);
				}
			}
		}

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
		Object.entries(userArray).map(obj => {
			embedFinalName.push(obj[1].final);
			embedCredits.push(obj[1].credits);
		});

		const embed = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('BLUE')
			.addField(lang.creditranklist_name, embedFinalName.join('\n'), true)
			.addField(lang.creditranklist_credits, embedCredits.join('\n'), true);

		msg.channel.send({ embed });
	}
};
