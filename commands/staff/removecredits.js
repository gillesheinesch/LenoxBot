const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class removecreditsCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'removecredits',
			group: 'staff',
			memberName: 'removecredits',
			description: 'Removes an user a certain amount of credits',
			format: 'removecredits {@USER} {amount}',
			aliases: [],
			examples: ['removecredits @Monkeyyy11#0001 2000'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Credits',
			dashboardsettings: true,
			cooldown: 300000
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const guild = msg.client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
		if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

		const user = msg.mentions.users.first() ? msg.mentions.users.first().id : args.slice(0, 1).join(' ');
		const amountofcoins = parseInt(args.slice(1).join(' '), 10);

		if (!msg.client.users.get(user)) return msg.reply(lang.removecredits_nomention);
		if (!amountofcoins) return msg.reply(lang.removecredits_novalue);

		let currentCredits = msg.client.provider.getUser(user, 'credits');
		currentCredits -= amountofcoins;
		await msg.client.provider.setUser(user, 'credits', currentCredits);

		const embeddescription = lang.removecredits_embeddescription.replace('%credits', amountofcoins).replace('%user', msg.client.users.get(user) ? msg.client.users.get(user).tag : user);
		const embed = new Discord.RichEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
			.setDescription(embeddescription)
			.setTimestamp()
			.setColor('RED');
		await msg.client.channels.get('497395598182318100').send({
			embed
		});

		const done = lang.removecredits_done.replace('%credits', amountofcoins);
		return msg.reply(done);
	}
};
