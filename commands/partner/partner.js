const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	if (!client.guilds.get('352896116812939264').members.get(msg.author.id).roles.find('name', 'Partner')) return msg.reply(lang.partner_error);
	console.log(1);

	const validation = ['lenoxbot', 'keinemxl', 'evilturtle'];
	const margs = msg.content.split(" ");

	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "lenoxbot") {
				const embed = new Discord.RichEmbed()
					.setDescription(`LenoxBot, not a Discord Bot but the Discord Bot. \n\nWe offer you a whole range of features! Administration, Moderation, Fun, Utility, Music, NSFW, Searches Commands and a whole application system for your guild server. **You can change all settings and customize the bot to your liking** \n\nHere you can find more information about LenoxBot: https://lenoxbot.com \n\nYou can join our Discord Server via this link: https://discord.gg/PjZM36X`)
					.setColor('#ff5050')
					.setAuthor(client.user.tag, client.user.displayAvatarURL);

				return msg.channel.send({
					embed
				});
			} else if (margs[1].toLowerCase() == "keinemxl") {
				const embed = new Discord.RichEmbed()
					.setDescription(`:warning: You are looking for a top organised Discord server? :warning: \n:rocket: If you are, just join the TeamEmil Discord server! You can meet YouTubers there and you can find new friends there. \n:bulb: You can also help us if you become a moderator or if you tell us your great ideas! \n:bellhop: So, what do you wait for? JOIN NOW! \n:white_check_mark: https://discord.gg/kkWP3Kj`)
					.setColor('#ff5050')
					.setAuthor(client.user.tag, client.user.displayAvatarURL);

				return msg.channel.send({
					embed
				});
			} else if (margs[1].toLowerCase() == "evilturtle") {
				const embed = new Discord.RichEmbed()
					.setDescription(`:crossed_swords: Largest SurvivalGames Discord ~ Friendly community :crossed_swords: \nEveryone is welcome, join us and make friends! :heart:️ \nhttps://discord.gg/WS6t2hM`)
					.setColor('#ff5050')
					.setAuthor(client.user.tag, client.user.displayAvatarURL);

				return msg.channel.send({
					embed
				});
			}
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};

exports.help = {
	name: 'partner',
	description: 'With this command you can use the embed of LenoxBot and your partnered server',
	usage: 'partner {serverownername}',
	example: ['partner lenoxbot'],
	category: 'partner',
	botpermissions: ['SEND_MESSAGES']
};
