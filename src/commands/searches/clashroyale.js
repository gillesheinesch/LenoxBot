const Discord = require('discord.js');
const api = require('clashroyale');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class clashroyaleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'clashroyale',
      group: 'searches',
      memberName: 'clashroyale',
      description: 'Shows you ClashRoyale stats about a player or a clan',
      format: 'clashroyale {profile or clan}',
      aliases: ['cr'],
      examples: ['clashroyale clan 2QLU0LYJ'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const validation = ['clan', 'profile'];
    const margs = msg.content.split(' ');

    if (!args[0] && !args[1]) return msg.channel.send(lang.clashroyale_noinput);

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'profile') {
          try {
            const profileResult = await api.getProfile(args[1]);
            const array = [];
            profileResult.currentDeck.forEach((x) => {
              array.push(x.name);
            });

            const profilestats = lang.clashroyale_profilestats.replace('%level', profileResult.experience.level).replace('%maxtrophies', profileResult.stats.maxTrophies).replace('%gamesplayed', profileResult.games.total)
              .replace('%wins', profileResult.games.wins)
              .replace('%loses', profileResult.games.losses)
              .replace('%draw', profileResult.games.draws);
            const clanstats = lang.clashroyale_clanstats.replace('%clanname', profileResult.clan.name).replace('%clanrole', profileResult.clan.role);
            const embed = new Discord.MessageEmbed()
              .setAuthor(`${profileResult.name} (#${profileResult.tag})`)
              .setFooter(lang.clashroyale_profilerequest)
              .setThumbnail('https://cdn.discordapp.com/attachments/353085017687064576/375975148341166080/oBvObTIz.png')
              .setColor('#f45942')
              .addField(lang.clashroyale_profile, profilestats)
              .addField(lang.clashroyale_arena, `${profileResult.arena.arena} (${profileResult.arena.name})`)
              .addField(lang.clashroyale_clan, clanstats)
              .addField(lang.clashroyale_deck, `${array.join(', ')}`);
            return msg.channel.send({ embed });
          }
          catch (error) {
            return msg.channel.send(lang.clashroyale_errorprofile);
          }
        }
        else if (margs[1].toLowerCase() === 'clan') {
          try {
            const clanResult = await api.getClan(args[1]);
            const clanArray = [];
            clanResult.members.forEach((x) => {
              clanArray.push(x.name);
            });

            const claninfo = lang.clashroyale_claninfo.replace('%clandescription', clanResult.description).replace('%type', clanResult.typeName).replace('%membercount', clanResult.memberCount)
              .replace('%score', clanResult.score)
              .replace('%donations', clanResult.donations);
            const clanchestinfo = lang.clashroyale_clanchestinfo.replace('%crowns', clanResult.clanChest.clanChestCrowns).replace('%neededcrowns', clanResult.clanChest.clanChestCrownsRequired).replace('%crownspercent', clanResult.clanChest.clanChestCrownsPercent);
            const embed = new Discord.MessageEmbed()
              .setAuthor(`${clanResult.name} (#${clanResult.tag})`)
              .setFooter(lang.clashroyale_clanrequest)
              .setThumbnail('https://cdn.discordapp.com/attachments/353085017687064576/375975148400017408/Clan-Battle.png')
              .setColor('#56bf88')
              .addField(lang.clashroyale_clan, claninfo)
              .addField(lang.clashroyale_clanchest, clanchestinfo)
              .addField(lang.clashroyale_allmembers, `${clanArray.join(', ')}`);
            return msg.channel.send({ embed });
          }
          catch (error) {
            return msg.channel.send(lang.clashroyale_errorclan);
          }
        }
      }
    }

    const errorclan = lang.clashroyale_errorclan.replace('%prefix', prefix);
    return msg.channel.send(errorclan);
  }
};
