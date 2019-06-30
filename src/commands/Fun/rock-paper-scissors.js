const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: (language) => language.get('COMMAND_ROCKPAPERSCISSORS_DESCRIPTION'),
			extendedHelp: (language) => language.get('COMMAND_ROCKPAPERSCISSORS_EXTENDEDHELP'),
			usage: '<Scissors|Rock|Paper:str>{4,8}',
			aliases: ['rps'],
			requiredPermissions: ['SEND_MESSAGES']
		});
	}

	

	run(message, [option]) {
		const margs = ['place_holder_value', option];
		const validation = message.language.get('COMMAND_ROCKPAPERSCISSORS_VALIDATION');
		const randomofvalidation = validation[Math.floor(Math.random() * validation.length)];

		if (!option) return message.reply(message.language.get('COMMAND_ROCKPAPERSCISSORS_NOINPUT'));

		for (let i = 0; i < margs.length; i++) {
			if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
				if (margs[1].toLowerCase() === message.language.get('COMMAND_ROCKPAPERSCISSORS_ROCK')) {
					if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_ROCK')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('BLUE')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_ROCKDRAW'))
						);
					} else if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_SCISSORS')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('GREEN')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_SCISSORSWIN'))
						);
					} else if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_PAPER')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('RED')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_PAPERLOST'))
						);
					}
				} else if (margs[1].toLowerCase() === message.language.get('COMMAND_ROCKPAPERSCISSORS_SCISSORS')) {
					if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_PAPER')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('GREEN')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_PAPERWIN'))
						);
					} else if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_ROCK')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('RED')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_ROCKLOST'))
						);
					} else if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_SCISSORS')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('BLUE')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_SCISSORSDRAW'))
						);
					}
				} else if (margs[1].toLowerCase() === message.language.get('COMMAND_ROCKPAPERSCISSORS_PAPER')) {
					if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_SCISSORS')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('RED')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_SCISSORSLOST'))
						);
					} else if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_PAPER')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('BLUE')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_PAPERDRAW'))
						);
					} else if (randomofvalidation === message.language.get('COMMAND_ROCKPAPERSCISSORS_ROCK')) {
						return message.channel.send(new MessageEmbed()
							.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
							.setColor('GREEN')
							.setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
							.setFooter(message.language.get('COMMAND_ROCKPAPERSCISSORS_EMBEDFOOTER'))
							.setDescription(message.language.get('COMMAND_ROCKPAPERSCISSORS_ROCKWIN'))
						);
					}
				}
			}
		}
		return message.reply(message.language.get('COMMAND_ROCKPAPERSCISSORS_ERROR'));
	}
};