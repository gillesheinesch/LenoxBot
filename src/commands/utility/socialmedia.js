const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class socialmediaCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'socialmedia',
      group: 'utility',
      memberName: 'socialmedia',
      description: 'Allows you to connect a social media account to your discord account',
      format: 'socialmedia {edit/delete/list} [youtube, twitch, instagram, twitter]',
      aliases: [],
      examples: ['socialmedia edit youtube Monkeyyy11', 'socialmedia delete twitch', 'socialmedia list'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const validation = ['delete', 'edit', 'list', lang.socialmedia_parameter_edit, lang.socialmedia_parameter_delete, lang.socialmedia_parameter_list];
    const validation2 = ['youtube', 'twitch', 'instagram', 'twitter', 'facebook', 'github', 'pinterest', 'reddit'];
    const margs = msg.content.split(' ');

    const promisesForNew = [];
    const promisesForDelete = [];

    if (args.slice().length === 0) return msg.reply(lang.socialmedia_error1);

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'edit' || margs[1].toLowerCase() === lang.socialmedia_parameter_edit.toLowerCase()) {
          if (args.slice(1).length === 0) return msg.reply(lang.socialmedia_error2);
          if (args.slice(2).length === 0) return msg.reply(lang.socialmedia_error3);
          for (let index = 0; index < margs.length; index += 1) {
            if (validation2.indexOf(margs[index].toLowerCase()) >= 0) {
              if (margs[2].toLowerCase() === 'youtube') {
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.youtube = args.slice(2).join(' ');
                promisesForNew.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_newyoutube);
              } if (margs[2].toLowerCase() === 'twitch') {
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.twitch = args.slice(2).join(' ');
                promisesForNew.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_newtwitch);
              } if (margs[2].toLowerCase() === 'instagram') {
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.instagram = args.slice(2).join(' ');
                promisesForNew.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_newinstagram);
              } if (margs[2].toLowerCase() === 'twitter') {
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.twitter = args.slice(2).join(' ');
                promisesForNew.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_newtwitter);
              } if (margs[2].toLowerCase() === 'facebook') {
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.facebook = args.slice(2).join(' ');
                promisesForNew.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_newfacebook);
              } if (margs[2].toLowerCase() === 'github') {
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.github = args.slice(2).join(' ');
                promisesForNew.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_newgithub);
              } if (margs[2].toLowerCase() === 'pinterest') {
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.pinterest = args.slice(2).join(' ');
                promisesForNew.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_newpinterest);
              } if (margs[2].toLowerCase() === 'reddit') {
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.reddit = args.slice(2).join(' ');
                promisesForNew.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_newreddit);
              }

              return await Promise.all(promisesForNew);
            }
          }
          const error4 = lang.socialmedia_error4.replace('%prefix', prefix);
          return msg.reply(error4);
        } if (margs[1].toLowerCase() === 'delete' || margs[1].toLowerCase() === lang.socialmedia_parameter_delete.toLowerCase()) {
          if (args.slice(1).length === 0) return msg.reply(lang.socialmedia_error2);
          for (let index = 0; index < margs.length; index += 1) {
            if (validation2.indexOf(margs[index].toLowerCase()) >= 0) {
              if (margs[2].toLowerCase() === 'youtube') {
                if (msg.client.provider.getUser(msg.author.id, 'socialmedia').youtube === '') return msg.reply(lang.socialmedia_notsetup);
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.youtube = '';
                promisesForDelete.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_deleteyoutube);
              } if (margs[2].toLowerCase() === 'twitch') {
                if (msg.client.provider.getUser(msg.author.id, 'socialmedia').twitch === '') return msg.reply(lang.socialmedia_notsetup);
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.twitch = '';
                promisesForDelete.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_deletetwitch);
              } if (margs[2].toLowerCase() === 'instagram') {
                if (msg.client.provider.getUser(msg.author.id, 'socialmedia').instagram === '') return msg.reply(lang.socialmedia_notsetup);
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.instagram = '';
                promisesForDelete.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_deleteinstagram);
              } if (margs[2].toLowerCase() === 'twitter') {
                if (msg.client.provider.getUser(msg.author.id, 'socialmedia').twitter === '') return msg.reply(lang.socialmedia_notsetup);
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.twitter = '';
                promisesForDelete.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_deletetwitter);
              } if (margs[2].toLowerCase() === 'facebook') {
                if (msg.client.provider.getUser(msg.author.id, 'socialmedia').facebook === '') return msg.reply(lang.socialmedia_notsetup);
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.facebook = '';
                promisesForDelete.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_deletefacebook);
              } if (margs[2].toLowerCase() === 'github') {
                if (msg.client.provider.getUser(msg.author.id, 'socialmedia').github === '') return msg.reply(lang.socialmedia_notsetup);
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.github = '';
                promisesForDelete.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_deletegithub);
              } if (margs[2].toLowerCase() === 'pinterest') {
                if (msg.client.provider.getUser(msg.author.id, 'socialmedia').pinterest === '') return msg.reply(lang.socialmedia_notsetup);
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.pinterest = '';
                promisesForDelete.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_deletepinterest);
              } if (margs[2].toLowerCase() === 'reddit') {
                if (msg.client.provider.getUser(msg.author.id, 'socialmedia').reddit === '') return msg.reply(lang.socialmedia_notsetup);
                const currentSocialmedia = msg.client.provider.getUser(msg.author.id, 'socialmedia');
                currentSocialmedia.reddit = '';
                promisesForDelete.push(msg.client.provider.setUser(msg.author.id, currentSocialmedia));

                return msg.reply(lang.socialmedia_deletereddit);
              }
              return await Promise.all(promisesForDelete);
            }
          }
          const error4 = lang.socialmedia_error4.replace('%prefix', prefix);
          return msg.reply(error4);
        } if (margs[1].toLowerCase() === 'list' || margs[1].toLowerCase() === lang.socialmedia_parameter_list.toLowerCase()) {
          const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor('BLUE');

          /* eslint guard-for-in: 0 */
          for (const key in msg.client.provider.getUser(msg.author.id, 'socialmedia')) {
            embed.addField(lang[`socialmedia_${key}`], msg.client.provider.getUser(msg.author.id, 'socialmedia')[key] === '' ? lang.socialmedia_notlinked : msg.client.provider.getUser(msg.author.id, 'socialmedia')[key]);
          }

          return msg.channel.send({
            embed
          });
        }
      }
    }
    const error4 = lang.socialmedia_error4.replace('%prefix', prefix);
    return msg.reply(error4);
  }
};
