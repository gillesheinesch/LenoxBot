const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class rockpaperscissorsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'rockpaperscissors',
      group: 'fun',
      memberName: 'rockpaperscissors',
      description: 'Play a round of rock–paper–scissors with the bot',
      format: 'rockpaperscissors {scissors, rock, paper}',
      aliases: ['rps'],
      examples: ['rockpaperscissors scissors'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const margs = msg.content.split(' ');
    const validation = ['scissors', 'rock', 'paper', lang.rockpaperscissors_parameter_scissors, lang.rockpaperscissors_parameter_paper, lang.rockpaperscissors_parameter_rock];
    const randomofvalidation = validation[Math.floor(Math.random() * validation.length)];

    if (!args.slice() || args.slice().length === 0) return msg.reply(lang.rockpaperscissors_noinput);

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'rock' || margs[1].toLowerCase() === lang.rockpaperscissors_parameter_rock.toLowerCase()) {
          if (randomofvalidation === 'rock') {
            const embed1 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('BLUE')
              .setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
              .setFooter(lang.rockpaperscissors_embedfooter)
              .setDescription(lang.rockpaperscissors_rockdraw);
            return msg.channel.send({
              embed: embed1
            });
          } if (randomofvalidation === 'scissors') {
            const embed2 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('GREEN')
              .setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
              .setFooter(lang.rockpaperscissors_embedfooter)
              .setDescription(lang.rockpaperscissors_scissorswin);
            return msg.channel.send({
              embed: embed2
            });
          } if (randomofvalidation === 'paper') {
            const embed3 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('RED')
              .setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
              .setFooter(lang.rockpaperscissors_embedfooter)
              .setDescription(lang.rockpaperscissors_paperlost);
            return msg.channel.send({
              embed: embed3
            });
          }
        }
        else if (margs[1].toLowerCase() === 'scissors' || margs[1].toLowerCase() === lang.rockpaperscissors_parameter_scissors.toLowerCase()) {
          if (randomofvalidation === 'paper') {
            const embed4 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('GREEN')
              .setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
              .setFooter(lang.rockpaperscissors_embedfooter)
              .setDescription(lang.rockpaperscissors_paperwin);
            return msg.channel.send({
              embed: embed4
            });
          } if (randomofvalidation === 'rock') {
            const embed5 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('RED')
              .setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
              .setFooter(lang.rockpaperscissors_embedfooter)
              .setDescription(lang.rockpaperscissors_rocklost);
            return msg.channel.send({
              embed: embed5
            });
          } if (randomofvalidation === 'scissors') {
            const embed6 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('BLUE')
              .setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
              .setFooter(lang.rockpaperscissors_embedfooter)
              .setDescription(lang.rockpaperscissors_scissorsdraw);
            return msg.channel.send({
              embed: embed6
            });
          }
        }
        else if (margs[1].toLowerCase() === 'paper' || margs[1].toLowerCase() === lang.rockpaperscissors_parameter_paper.toLowerCase()) {
          if (randomofvalidation === 'scissors') {
            const embed7 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('RED')
              .setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
              .setFooter(lang.rockpaperscissors_embedfooter)
              .setDescription(lang.rockpaperscissors_scissorslost);
            return msg.channel.send({
              embed: embed7
            });
          } if (randomofvalidation === 'paper') {
            const embed8 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('BLUE')
              .setThumbnail('https://cdn.discordapp.com/attachments/339131858283528192/341322660397056003/spieltipp-schere-stein-papier.png')
              .setFooter(lang.rockpaperscissors_embedfooter)
              .setDescription(lang.rockpaperscissors_paperdraw);
            return msg.channel.send({
              embed: embed8
            });
          } if (randomofvalidation === 'rock') {
            const embed9 = new Discord.MessageEmbed()
              .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
              .setColor('GREEN')
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
    const rockpaperscissors_error = lang.rockpaperscissors_error.replace('%prefix', prefix);
    return msg.reply(rockpaperscissors_error);
  }
};
