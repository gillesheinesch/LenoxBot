const moment = require('moment');
require('moment-duration-format');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { Util } = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class playplaylistCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'playplaylist',
      group: 'music',
      memberName: 'playplaylist',
      description: 'Plays a music playlist',
      format: 'playplaylist {name of the playlist}',
      aliases: [],
      examples: ['playplaylist DJKhaled-Playlist'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Musicplayersettings',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const { skipvote } = msg.client;
    const { queue } = msg.client;
    let serverQueue = await queue.get(msg.guild.id);
    const voiceChannel = msg.member.voice.channel;
    moment.locale(msg.client.provider.getGuild(msg.guild.id, 'momentLanguage'));

    const value = msg.client.provider.getGuild(msg.guild.id, 'playlist');
    if (typeof value === 'object' && value instanceof Array) {
      const newPlaylist = {};
      await msg.client.provider.setGuild(msg.guild.id, 'playlist', newPlaylist);
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'premium').status === false) return msg.reply(lang.playlist_noguildpremium);
    if (args.slice().length === 0 || !args) return msg.reply(lang.playplaylist_error);
    if (!msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice().join(' ').toLowerCase()]) return msg.reply(lang.playlist_playlistnotexist);

    if (!voiceChannel) return msg.channel.send(lang.play_notvoicechannel);

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist').length; i += 1) {
      if (voiceChannel.id === msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist')[i]) return msg.reply(lang.play_blacklistchannel);
    }

    if (serverQueue) {
      if ((serverQueue.songs.length + Object.keys(msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice().join(' ').toLowerCase()]).length) > 8 && msg.client.provider.getGuild(msg.guild.id, 'premium').status === false) return msg.reply(lang.play_limitreached);
    }

    async function play(guild, song) {
      serverQueue = await queue.get(msg.guild.id);

      if (!song) {
        await serverQueue.voiceChannel.leave();
        await queue.delete(guild.id);
        return;
      }
      const dispatcher = await serverQueue.connection.play(ytdl(song.url), {
        filter: 'audioonly'
      })
        .on('end', async (reason) => {
          if (reason === 'Stream is not generating quickly enough.');
          serverQueue.songs.shift('Stream is not generating quickly enough');
          await play(guild, serverQueue.songs[0]);
        })
        .on('error', (error) => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

      const vote = {
        users: []
      };
      skipvote.set(msg.guild.id, vote);

      const duration = lang.play_duration.replace('%duration', song.duration);
      const published = lang.play_published.replace('%publishedatdate', song.publishedat);
      const embed = new Discord.MessageEmbed()
        .setAuthor(lang.play_startplaying)
        .setDescription(duration)
        .setThumbnail(song.thumbnail)
        .setColor('#009900')
        .setURL(song.url)
        .setFooter(published)
        .setTitle(song.title);

      return msg.channel.send({
        embed
      });
    }

    async function handleVideo(video, playlist = false) {
      const song = {
        duration: moment.duration(video.duration).format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`),
        thumbnail: video.thumbnails.default.url,
        publishedat: video.publishedAt,
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
      };

      if (moment.duration(video.duration).format('m') > 30 && msg.client.provider.getUser(msg.author.id, 'premium').status === false) return msg.reply(lang.play_songlengthlimit);

      if (serverQueue) {
        await serverQueue.songs.push(song);
        if (playlist) return;

        const duration = lang.play_duration.replace('%duration', song.duration);
        const published = lang.play_published.replace('%publishedatdate', song.publishedat);
        const embed = new Discord.MessageEmbed()
          .setAuthor(lang.play_songadded)
          .setDescription(duration)
          .setThumbnail(song.thumbnail)
          .setColor('#009900')
          .setURL(song.url)
          .setFooter(published)
          .setTitle(song.title);

        return msg.channel.send({
          embed
        });
      }
      else {
        /* eslint no-else-return: 0 */
        const queueConstruct = {
          textChannel: msg.channel,
          voiceChannel,
          connection: null,
          songs: [],
          volume: 2,
          playing: true
        };
        await queue.set(msg.guild.id, queueConstruct);

        await queueConstruct.songs.push(song);

        const vote = {
          users: []
        };

        skipvote.set(msg.guild.id, vote);

        try {
          const connection = await voiceChannel.join();
          queueConstruct.connection = connection;
          await play(msg.guild, queueConstruct.songs[0]);
        }
        catch (error) {
          await queue.delete(msg.guild.id);
          await skipvote.delete(msg.guild.id);
          return msg.channel.send(lang.play_errorjoin);
        }
      }
    }
    /* eslint guard-for-in: 0 */
    for (const song in msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice().join(' ').toLowerCase()]) {
      const video = msg.client.provider.getGuild(msg.guild.id, 'playlist')[args.slice().join(' ').toLowerCase()][song];
      await handleVideo(video, msg, voiceChannel);
    }
  }
};
