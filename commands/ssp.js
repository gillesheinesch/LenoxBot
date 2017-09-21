const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	var margs = msg.content.split(' ');
	let validation = ['scissors', 'stone', 'paper'];
	let randomofvalidation = validation[Math.floor(Math.random() * validation.length)];

	if (typeof margs[1] !== 'undefined');

	for (i = 0; i < margs.length; i++) {
			if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
				if (margs[1].toLowerCase() === 'stone') {
					if (randomofvalidation === 'stone') {
						const embed1 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`Scissors, stone and paper minigame`)
			.setDescription(`**I've chosen stone! ✊** \nDraw!`);
						msg.channel.send({ embed: embed1 });
					} else
			if (randomofvalidation === 'scissors') {
				const embed2 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`Scissors, stone and paper minigame`)
			.setDescription(`**I've chosen scissors! ✌** \nYou won!`);
				msg.channel.send({ embed: embed2 });
			} else
			if (randomofvalidation === 'paper') {
				const embed3 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`Scissors, stone and paper minigame`)
			.setDescription(`**I've chosen paper! ✋** \nYou lost!`);
				msg.channel.send({ embed: embed3 });
			}
				} else
		if (margs[1].toLowerCase() === 'scissors') {
			if (randomofvalidation === 'paper') {
			 const embed4 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`Scissors, stone and paper minigame`)
			.setDescription(`**I've chosen paper! ✋** \nYou won!`);
				msg.channel.send({ embed: embed4 });
			} else
			if (randomofvalidation === 'stone') {
				const embed5 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`Scissors, stone and paper minigame`)
			.setDescription(`**I've chosen stone! ✊** \nYou lost!`);
				msg.channel.send({ embed: embed5 });
			} else

			if (randomofvalidation === 'scissors') {
				const embed6 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`Scissors, stone and paper minigame`)
			.setDescription(`**I've chosen scissors! ✌** \nDraw!`);
				msg.channel.send({ embed: embed6 });
			}
		} else
		if (margs[1].toLowerCase() === 'paper') {
			if (randomofvalidation === 'scissors') {
				const embed7 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`Scissors, stone and paper minigame`)
			.setDescription(`**I've chosen scissors! ✌** \nYou lost!`);
				msg.channel.send({ embed: embed7 });
			} else

			if (randomofvalidation === 'paper') {
				const embed8 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`scissors, stone and paper minigame`)
			.setDescription(`**I've chosen paper! ✋** \nDraw!`);
				msg.channel.send({ embed: embed8 });
			} else

			if (randomofvalidation === 'stone') {
				const embed9 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setColor('#0066CC')
			.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
			.setFooter(`Scissors, stone and paper minigame`)
			.setDescription(`**I've chosen stone! ✊** \nYou won!`);
				msg.channel.send({ embed: embed9 });
			}
		}
			}
		}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'ssp',
	description: 'Play a round of scissors & stone & paper',
	usage: 'ssp {scissors, stone, paper}',
	example: 'ssp scissors',
	category: 'fun'
};
