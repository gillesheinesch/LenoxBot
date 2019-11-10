const Discord = require('discord.js');
const { Util } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const YouTube = require('simple-youtube-api');
const config = require('../../settings.json');
const LenoxCommand = require('../LenoxCommand.js');

const youtube = new YouTube(config.googlekey);
const validation = ['new', 'delete', 'list', 'addsong', 'removesong'];

module.exports = class playlistCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'playlist',
      group: 'music',
      memberName: 'playlist',
      description: 'Create new Music playlists on this Discord server',
      format: 'playlist {new/delete/list/addsong/removesong} {name of the playlist}',
      aliases: [],
      examples: ['playlist new DJKhaled', 'playlist list', 'playlist list DJKhaled', 'playlist delete DJKhaled', 'playlist addsong DJKhaled', 'playlist removesong DJKhaled'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['MANAGE_GUILD'],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');
    const args = msg.content.split(' ').slice(1);

    const margs = msg.content.split(' ');
    let newplaylisttitle = '';
    const newplaylistsongs = [];
    moment.locale(msg.client.provider.getGuild(msg.guild.id, 'momentLanguage'));

    const value = msg.client.provider.getGuild(msg.guild.id, 'playlist');
    if (typeof value === 'object' && value instanceof Array) {
      const newPlaylist = {};
      await msg.client.provider.setGuild(msg.guild.id, 'playlist', newPlaylist);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'premium').status === false) return msg.reply(lang.playlist_noguildpremium);

    for (let i = 0; i < margs.length; i += 1) {
      if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
        if (margs[1].toLowerCase() === 'new') {
          if (Object.keys(msg.client.provider.getGuild(msg.guild.id, 'playlist')).length >= 8) return msg.reply(lang.playlist_maxplaylist);
          if (!args.slice(1) || args.slice(1).length === 0) return msg.reply(lang.playlist_errortitle);
          if (args.slice(1).join(' ').length > 30) return msg.reply(lang.playlist_titlelengtherror);
          if (msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice(1).join(' ').toLowerCase()]) return msg.reply(lang.playlist_alreadyexists);

          newplaylisttitle = args.slice(1).join(' ').toLowerCase();

          const addnewsong = lang.playlist_addnewsong.replace('%playlistname', newplaylisttitle);
          await msg.reply(addnewsong);
          for (let index2 = 0; index2 < 100; index2++) {
            try {
              const responsesongs = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id, {
                max: 1,
                time: 60000,
                errors: ['time']
              });

              if (responsesongs.first().content.toLowerCase() === 'finish') {
                const currentPlaylist = msg.client.provider.getGuild(msg.guild.id, 'playlist');
                currentPlaylist[newplaylisttitle.toLowerCase()] = newplaylistsongs;
                await msg.client.provider.setGuild(msg.guild.id, 'playlist', currentPlaylist);
                return msg.reply(lang.playlist_finish);
              }

              const url = responsesongs.first().content ? responsesongs.first().content.replace(/<(.+)>/g, '$1') : '';
              if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                const playlist = await youtube.getPlaylist(url);
                const videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                  const video2 = await youtube.getVideoByID(video.id);
                  if (moment.duration(video.duration).format('m') > 30 && msg.client.provider.getUser(msg.author.id, 'premium').status === false) {
                    return msg.reply(lang.play_songlengthlimit);
                  }
                  newplaylistsongs.push(video2);
                }
                await responsesongs.delete();
                const newsongaddedtoplaylist = lang.playlist_newsongaddedtoplaylist.replace('%songname', playlist.title);
                msg.channel.send(newsongaddedtoplaylist);
              }
              else {
                try {
                  await youtube.getVideo(url);
                }
                catch (err) {
                  try {
                    const searchString = responsesongs.first().content;
                    const videos = await youtube.searchVideos(searchString, 10);

                    if (videos.length === 0) return msg.channel.send(lang.play_noresult);

                    let index = 0;
                    const embed = new Discord.MessageEmbed()
                      .setColor('#7BB3FF')
                      .setDescription(`${videos.map((video2) => `**${++index} -** ${video2.title}`).join('\n')}`)
                      .setAuthor(lang.play_songselection, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');

                    const embed2 = new Discord.MessageEmbed()
                      .setColor('#0066CC')
                      .setDescription(lang.play_value);
                    const firstmessage = await msg.channel.send({
                      embed
                    });
                    const secondmessage = await msg.channel.send({
                      embed: embed2
                    });
                    let response;
                    try {
                      response = await msg.channel.awaitMessages((msg2) => msg2.content > 0 && msg2.content < 11 && msg.author.id === msg2.author.id, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                      });
                    }
                    catch (err2) {
                      return msg.channel.send(lang.playlist_timeerror);
                    }
                    const videoIndex = parseInt(response.first().content, 10);
                    const video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    await firstmessage.delete();
                    await secondmessage.delete();

                    if (moment.duration(video.duration).format('m') > 30 && msg.client.provider.getUser(msg.author.id, 'premium').status === false) {
                      return msg.reply(lang.play_songlengthlimit);
                    }
                    newplaylistsongs.push(video);


                    if (newplaylistsongs.length === 12) {
                      const currentPlaylist = msg.client.provider.getGuild(msg.guild.id, 'playlist');
                      currentPlaylist[newplaylisttitle.toLowerCase()] = newplaylistsongs;
                      await msg.client.provider.setGuild(msg.guild.id, 'playlist', currentPlaylist);
                      return msg.reply(lang.playlist_finish);
                    }
                    const newsongaddedtoplaylist = lang.playlist_newsongaddedtoplaylist.replace('%songname', Util.escapeMarkdown(video.title));
                    msg.reply(newsongaddedtoplaylist);
                  }
                  catch (err3) {
                    return msg.channel.send(lang.play_noresult);
                  }
                }
              }
            }
            catch (err) {
              return msg.channel.send(lang.playlist_timeerror);
            }
          }
        }
        else if (margs[1].toLowerCase() === 'list') {
          const noplaylistaddedyet = lang.playlist_noplaylistaddedyet.replace('%prefix', prefix);
          if (Object.keys(msg.client.provider.getGuild(msg.guild.id, 'playlist')).length === 0) return msg.reply(noplaylistaddedyet);

          if (args.slice(1).length !== 0 && args.slice(1) !== '') {
            const input = args.slice(1);

            if (!msg.client.provider.getGuild(msg.guild.id, 'playlist')[input.join(' ').toLowerCase()]) return msg.reply(lang.playlist_playlistnotexist);

            const listsongplaylist = new Discord.MessageEmbed()
              .setAuthor(lang.playlist_embedtitle)
              .setColor('#66ff33');

            const songtitlearray = [];
            /* eslint guard-for-in: 0 */
            for (const x in msg.client.provider.getGuild(msg.guild.id, 'playlist')[input.join(' ').toLowerCase()]) {
              songtitlearray.push(msg.client.provider.getGuild(msg.guild.id, 'playlist')[input.join(' ').toLowerCase()][x].title);
            }

            listsongplaylist.setDescription(`${songtitlearray.join('\n')}`);

            return msg.channel.send({
              embed: listsongplaylist
            });
          }
          const listplaylistobject = [];
          const listplaylistembed = new Discord.MessageEmbed()
            .setAuthor(lang.playlist_playlistserverembed)
            .setColor('#66ff33');

          for (const x in msg.client.provider.getGuild(msg.guild.id, 'playlist')) {
            listplaylistobject.push(x);
          }

          listplaylistembed.setDescription(`${listplaylistobject.join('\n')}`);

          return msg.channel.send({
            embed: listplaylistembed
          });
        }
        else if (margs[1].toLowerCase() === 'delete') {
          if (!msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice(1).join(' ').toLowerCase()]) return msg.reply(lang.playlist_playlistnotexist);

          const currentPlaylist = msg.client.provider.getGuild(msg.guild.id, 'playlist');
          delete currentPlaylist[args.slice(1).join(' ').toLowerCase()];
          await msg.client.provider.setGuild(msg.guild.id, 'playlist', currentPlaylist);

          return msg.reply(lang.playlist_deleted);
        }
        else if (margs[1].toLowerCase() === 'addsong') {
          if (!msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice(1).join(' ').toLowerCase()]) return msg.reply(lang.playlist_playlistnotexist);
          if (msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice(1).join(' ').toLowerCase()].length >= 12) return msg.reply(lang.playlist_max12songs);

          const selectedplaylist = msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice(1).join(' ').toLowerCase()];

          await msg.channel.send(lang.playlist_questionaddnewsong);
          try {
            const newsongaddtoplaylist = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id, {
              max: 1,
              time: 60000,
              errors: ['time']
            });

            const url = newsongaddtoplaylist.first().content ? newsongaddtoplaylist.first().content.replace(/<(.+)>/g, '$1') : '';
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
              const playlist = await youtube.getPlaylist(url);
              const videos = await playlist.getVideos();
              for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                if (moment.duration(video.duration).format('m') > 30 && msg.client.provider.getUser(msg.author.id, 'premium').status === false) {
                  return msg.reply(lang.play_songlengthlimit);
                }
                selectedplaylist.push(video2);
              }
              const newsongadded = lang.playlist_newsongadded.replace('%songname', playlist.title);
              return msg.channel.send(newsongadded);
            }
            try {
              await youtube.getVideo(url);
            }
            catch (err4) {
              try {
                const searchString = newsongaddtoplaylist.first().content;
                const videos = await youtube.searchVideos(searchString, 10);

                if (videos.length === 0) return msg.channel.send(lang.play_noresult);

                let index = 0;
                const embed = new Discord.MessageEmbed()
                  .setColor('#7BB3FF')
                  .setDescription(`${videos.map((video2) => `**${++index} -** ${video2.title}`).join('\n')}`)
                  .setAuthor(lang.play_songselection, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');

                const embed2 = new Discord.MessageEmbed()
                  .setColor('#0066CC')
                  .setDescription(lang.play_value);

                await msg.channel.send({
                  embed
                });
                await msg.channel.send({
                  embed: embed2
                });

                let response;
                try {
                  response = await msg.channel.awaitMessages((msg2) => msg2.content > 0 && msg2.content < 11 && msg.author.id === msg2.author.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                  });
                }
                catch (err) {
                  return msg.channel.send(lang.playlist_timeerror);
                }
                const videoIndex = parseInt(response.first().content, 10);
                const video = await youtube.getVideoByID(videos[videoIndex - 1].id);

                if (moment.duration(video.duration).format('m') > 30 && msg.client.provider.getUser(msg.author.id, 'premium').status === false) {
                  return msg.reply(lang.play_songlengthlimit);
                }
                selectedplaylist.push(video);

                const newsongadded = lang.playlist_newsongadded.replace('%songname', Util.escapeMarkdown(video.title));
                return msg.reply(newsongadded);
              }
              catch (err) {
                return msg.channel.send(lang.play_noresult);
              }
            }
          }
          catch (err) {
            return msg.channel.send(lang.playlist_timeerror);
          }
        }
        else if (margs[1].toLowerCase() === 'removesong') {
          if (!msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice(1).join(' ').toLowerCase()]) return msg.reply(lang.playlist_playlistnotexist);

          await msg.reply(lang.playlist_questionremovesong);
          let removesong;
          try {
            removesong = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id, {
              max: 1,
              time: 60000,
              errors: ['time']
            });
          }
          catch (err) {
            return msg.channel.send(lang.playlist_timeerror);
          }

          for (const x in msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice(1).join(' ').toLowerCase()]) {
            if (msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice(1).join(' ').toLowerCase()][x].title.toLowerCase() === removesong.first().content.toLowerCase()) {
              const currentPlaylist = msg.client.provider.getGuild(msg.guild.id, 'playlist');
              delete currentPlaylist[args.slice(1).join(' ').toLowerCase()][x];
              await msg.client.provider.getGuild(msg.guild.id, 'playlist', currentPlaylist);

              const removedsong = lang.playlist_removedsong.replace('%songname', x.title);
              return msg.reply(removedsong);
            }
          }
          return msg.reply(lang.playlist_songnotinplaylist);
        }
      }
    }
    const error = lang.playlist_error.replace('%prefix', prefix);
    return msg.reply(error);
  }
};
