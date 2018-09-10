const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const margs = msg.content.split(' ');
	const validation = ['scissors', 'rock', 'paper'];
	const randomofvalidation = validation[Math.floor(Math.random() * validation.length)];

	if (!args.slice() || args.slice().length === 0) return msg.reply(lang.rockpaperscissors_noinput);

	for (let i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'rock') {
				if (randomofvalidation === 'rock') {
					const embed1 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_rockdraw);
					return msg.channel.send({
						embed: embed1
					});
				} else if (randomofvalidation === 'scissors') {
					const embed2 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_scissorswin);
					return msg.channel.send({
						embed: embed2
					});
				} else if (randomofvalidation === 'paper') {
					const embed3 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_paperlost);
					return msg.channel.send({
						embed: embed3
					});
				}
			} else if (margs[1].toLowerCase() === 'scissors') {
				if (randomofvalidation === 'paper') {
					const embed4 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_paperwin);
					return msg.channel.send({
						embed: embed4
					});
				} else if (randomofvalidation === 'rock') {
					const embed5 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_rocklost);
					return msg.channel.send({
						embed: embed5
					});
				} else if (randomofvalidation === 'scissors') {
					const embed6 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_scissorsdraw);
					return msg.channel.send({
						embed: embed6
					});
				}
			} else if (margs[1].toLowerCase() === 'paper') {
				if (randomofvalidation === 'scissors') {
					const embed7 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_scissorslost);
					return msg.channel.send({
						embed: embed7
					});
				} else if (randomofvalidation === 'paper') {
					const embed8 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_paperdraw);
					return msg.channel.send({
						embed: embed8
					});
				} else if (randomofvalidation === 'rock') {
					const embed9 = new Discord.RichEmbed()
						.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
						.setColor('#0066CC')
						.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
						.setFooter(lang.rockpaperscissors_embedfooter)
						.setDescription(lang.rockpaperscissors_rockwin);
					return msg.channel.send({
						embed: embed9
					});
				}
			}
		}
	}
	return msg.reply(lang.rockpaperscissors_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: ['rps'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'rockpaperscissors',
	description: 'Play a round of rock–paper–scissors with the bot',
	usage: 'rockpaperscissors {scissors, rock, paper}',
	example: ['rockpaperscissors scissors'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
