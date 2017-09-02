const Discord = require('discord.js');

exports.run = (client, msg, args) => {
    let arg = msg.content.split(' ').slice(2).join(' ');
    let validation = ['profile', 'quickplay', 'competitive'];
    const OWStats = require('overwatch-stats');
    var margs = msg.content.split(" ");

if (typeof margs[1] !== "undefined");

if (!margs[0]) return msg.reply(`Du musst entscheiden ob du dir die \`profile\`, \`quickplay\`, \`competitive\` Statistiken vom Overwatch-Spieler anzeigen lassen möchtest`).then(m => m.delete(30000));
if (!margs[1]) return msg.reply('Du hast vergessen deinen BattleTag einzugeben. `Achtung: "Case sensitive", das heißt dass du deinen BattleTag so eingeben musst, wie er da steht (Groß/Kleinschreibung muss beachtet werden)`.').then(m => m.delete(30000));
if (!arg.includes('#')) return msg.reply('Ungültiger BattleTag. `Beispiel: Monkeyyy11#2761`').then(m => m.delete(15000));
if (arg.split('#').length > 6) return msg.reply('Höh, dein BattleTag hat mehr als 6 Zeichen?! Da muss was falsch sein 🤔').then(m => m.delete(15000));
    
for (i = 0; i < margs.length; i++) {
    if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
    if (margs[1].toLowerCase() === "profile") {
    OWStats.load(arg)
    .then(data => {
        if (!data.body.eu.stats.quickplay.overall_stats.avatar) {
            return msg.reply('Dieser BattleTag existiert nicht.').then(m => m.delete(15000));
        }
    const embed = new Discord.RichEmbed()
      .setAuthor(`Profil Statistiken von ${arg}`, data.body.eu.stats.competitive.overall_stats.avatar)
      .setDescription(`**Sternabzeichen:** ${data.body.eu.stats.competitive.overall_stats.prestige} \n**Level**: ${data.body.eu.stats.competitive.overall_stats.level} \n**Competitive-Rank** ${data.body.eu.stats.competitive.overall_stats.comprank}`)
      .setThumbnail(data.body.eu.stats.competitive.overall_stats.avatar)
      .setColor('#0066CC');
        msg.channel.send({ embed }).catch(console.error);
    }).catch(err => {
        msg.channel.send('Konnte deine Daten nicht abfragen, ' + arg);
    });
} else 
    if (margs[1].toLowerCase() === "quickplay") {
    OWStats.load(arg)
    .then(data => {
        if (!data.body.eu.stats.quickplay.overall_stats.avatar) {
            return msg.reply('Dieser BattleTag existiert nicht.').then(m => m.delete(15000));
        }
    const embed = new Discord.RichEmbed()
      .setAuthor(`Quickplay Statistiken von ${arg}`, data.body.eu.stats.competitive.overall_stats.avatar)
      .setDescription(`**Winrate:** ${data.body.eu.stats.quickplay.overall_stats.win_rate} \n**Spiele:** ${data.body.eu.stats.quickplay.overall_stats.games} \n**Wins:** ${data.body.eu.stats.quickplay.overall_stats.wins} \n**Losses:** ${data.body.eu.stats.quickplay.overall_stats.losses}`)
      .setThumbnail(data.body.eu.stats.competitive.overall_stats.avatar)
      .setColor('#0066CC');
        msg.channel.send({ embed }).catch(console.error);
    }).catch(err => {
        msg.channel.send('Konnte deine Daten nicht abfragen, ' + arg);
    });
} else 
    if (margs[1].toLowerCase() === "competitive") {
        OWStats.load(arg)
        .then(data => {
            if (!data.body.eu.stats.quickplay.overall_stats.avatar) {
                return msg.reply('Dieser BattleTag existiert nicht.').then(m => m.delete(15000));
            }
        const embed = new Discord.RichEmbed()
          .setAuthor(`Competitive Statistiken von ${arg}`, data.body.eu.stats.competitive.overall_stats.avatar)
          .setDescription(`**Winrate:** ${data.body.eu.stats.competitive.overall_stats.win_rate} \n**Spiele:** ${data.body.eu.stats.competitive.overall_stats.games} \n**Wins:** ${data.body.eu.stats.competitive.overall_stats.wins} \n**Losses:** ${data.body.eu.stats.competitive.overall_stats.losses}`)
          .setThumbnail(data.body.eu.stats.competitive.overall_stats.avatar)
          .setColor('#0066CC');
            msg.channel.send({ embed }).catch(console.error);
        }).catch(err => {
            msg.channel.send('Konnte deine Daten nicht abfragen, ' + arg);
        });
    }
}
}
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['ow']
  };

  exports.help = {
    name: 'overwatch',
    description: 'Shows you overwatch-stats about a Overwatch player',
    usage: 'overwatch {profile, quickplay, competitive} {BATTLETAG}',
    example: 'overwatch profile Monkeyyy11#2761'
  };

