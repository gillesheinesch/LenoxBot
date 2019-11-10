const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class partnerCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'partner',
      group: 'partner',
      memberName: 'partner',
      description: 'With this command you can use the embed of LenoxBot and your partnered server',
      format: 'partner {serverownername}',
      aliases: [],
      examples: ['partner lenoxbot'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const fetchedMember = await msg.client.guilds.get(settings.botMainDiscordServer).members.fetch(msg.author.id);
    if (!fetchedMember.roles.find((r) => r.name.toLowerCase() === 'partner')) return msg.reply(lang.partner_error);

    const validation = ['lenoxbot', 'keinemxl', 'evilturtle', 'dadi'];
    const margs = msg.content.split(' ');

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'lenoxbot') {
          const embed = new Discord.MessageEmbed()
            .setDescription('LenoxBot, not a Discord Bot but the Discord Bot. \n\nWe offer you a whole range of features! Administration, Moderation, Fun, Utility, Music, NSFW, Searches Commands and a whole application system for your guild server. **You can change all settings and customize the bot to your liking** \n\nHere you can find more information about LenoxBot: https://lenoxbot.com \n\nYou can join our Discord Server via this link: https://lenoxbot.com/discord')
            .setColor('#ff5050')
            .setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL());

          return msg.channel.send({
            embed
          });
        } if (margs[1].toLowerCase() === 'keinemxl' && msg.guild.id === '293781355144282112') {
          const embed = new Discord.MessageEmbed()
            .setDescription(':warning: You are looking for a top organised Discord server? :warning: \n:rocket: If you are, just join the TeamEmil Discord server! You can meet YouTubers there and you can find new friends there. \n:bulb: You can also help us if you become a moderator or if you tell us your great ideas! \n:bellhop: So, what do you wait for? JOIN NOW! \n:white_check_mark: https://discord.gg/kkWP3Kj')
            .setColor('#ff5050')
            .setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL());

          return msg.channel.send({
            embed
          });
        } if (margs[1].toLowerCase() === 'evilturtle' && msg.guild.id === '339023050093625356') {
          const embed = new Discord.MessageEmbed()
            .setDescription(':crossed_swords: Largest SurvivalGames Discord ~ Friendly community :crossed_swords: \nEveryone is welcome, join us and make friends! :heart:️ \nhttps://discord.gg/WS6t2hM')
            .setColor('#ff5050')
            .setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL());

          return msg.channel.send({
            embed
          });
        } if (margs[1].toLowerCase() === 'dadi' && msg.guild.id === '328269870158315520') {
          const embed = new Discord.MessageEmbed()
            .setDescription(':sparkler: You, yes you! :sparkler: \nAre you bored with other Discord Servers? Join the Emphoia Discord Server and you will never be bored again!\nDo not hesitate, join now! :wink: \n\nWhat advantages do you expect?\n:arrow_forward: A nice and cool Community\n:arrow_forward: Varied voice and text channels\n:arrow_forward: Much fun\n\nThat´s not all...\nConvince yourself!\n:sparkler:  https://discord.gg/wsffwaD :sparkler:')
            .setColor('#ff5050')
            .setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL());

          return msg.channel.send({
            embed
          });
        }
      }
    }
  }
};
