const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const config = require('../../settings.json');
	const tableload = client.guildconfs.get(msg.guild.id);
	const moment = require('moment');
	require('moment-duration-format');
	const {
		Client,
		Util
	} = require('discord.js');
	const userdb = client.userdb.get(msg.author.id);
	const YouTube = require('simple-youtube-api');
	const youtube = new YouTube(config.googlekey);
	const queue = client.queue;
	const skipvote = client.skipvote;
	const input = msg.content.split(' ');
	const ytdl = require('ytdl-core');
	if (msg.author.bot) return undefined;
	const searchString = input.slice(1).join(' ');
	const url = input[1] ? input[1].replace(/<(.+)>/g, '$1') : '';


	const voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel) return msg.channel.send(lang.play_notvoicechannel);

	for (var i = 0; i < tableload.musicchannelblacklist.length; i++) {
		if (voiceChannel.id === tableload.musicchannelblacklist[i]) return msg.reply(lang.play_blacklistchannel);
	}

	if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
		const playlist = await youtube.getPlaylist(url);
		const videos = await playlist.getVideos();
		for (const video of Object.values(videos)) {
			const video2 = await youtube.getVideoByID(video.id);
			await handleVideo(video2, msg, voiceChannel, true);
		}
		var playlistadded = lang.play_playlistadded.replace('%playlisttitle', `**${playlist.title}**`);
		return msg.channel.send(playlistadded);
	} else {
		try {
			var video = await youtube.getVideo(url);
		} catch (error) {
			try {
				var videos = await youtube.searchVideos(searchString, 10);

				if (videos.length === 0) return msg.channel.send(lang.play_noresult);

				let index = 0;
				const embed = new Discord.RichEmbed()
					.setColor('#7BB3FF')
					.setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
					.setAuthor(lang.play_songselection, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');

				const embed2 = new Discord.RichEmbed()
					.setColor('#0066CC')
					.setDescription(lang.play_value);
				msg.channel.send({
					embed
				});
				msg.channel.send({
					embed: embed2
				});
				try {
					var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 10000,
						errors: ['time']
					});
				} catch (err) {
					return msg.channel.send(lang.play_error);
				}
				const videoIndex = parseInt(response.first().content);
				var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			} catch (err) {
				return msg.channel.send(lang.play_noresult);
			}
		}
		return handleVideo(video, msg, voiceChannel);
	}
	async function handleVideo(video, msg, voiceChannel, playlist = false) {
		const serverQueue = queue.get(msg.guild.id);
		const song = {
			duration: moment.duration(video.duration).format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`),
			thumbnail: video.thumbnails.default.url,
			publishedat: video.publishedAt,
			id: video.id,
			title: Util.escapeMarkdown(video.title),
			url: `https://www.youtube.com/watch?v=${video.id}`
		};

		if (moment.duration(video.duration).format('m') > 30 && userdb.premium.status === false) return msg.reply(lang.play_songlengthlimit);

		if (!serverQueue) {
			const queueConstruct = {
				textChannel: msg.channel,
				voiceChannel: voiceChannel,
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
				var connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				await play(msg.guild, queueConstruct.songs[0]);
			} catch (error) {
				await queue.delete(msg.guild.id);
				await skipvote.delete(msg.guild.id);
				return msg.channel.send(lang.play_errorjoin);
			}
		} else {
			if (serverQueue.songs.length >= 8 && tableload.premium.status === false) return msg.reply(lang.play_limitreached);
			await serverQueue.songs.push(song);
			if (playlist) return undefined;
			else {
				const duration = lang.play_duration.replace('%duration', song.duration);
				const published = lang.play_published.replace('%publishedatdate', song.publishedat);
				const embed = new Discord.RichEmbed()
				.setAuthor(lang.play_songadded)
				.setDescription(duration)
				.setThumbnail(song.thumbnail)
				.setColor('#009900')
				.setURL(song.url)
				.setFooter(published)
				.setTitle(song.title);

				return msg.channel.send({ embed });
			}
		}
		return undefined;
	}

	async function play(guild, song) {
		const serverQueue = await queue.get(guild.id);

		if (!song) {
			await serverQueue.voiceChannel.leave();
			await queue.delete(guild.id);
			return undefined;
		}
		const dispatcher = await serverQueue.connection.playStream(ytdl(song.url), {
				filter: 'audioonly'
			})
			.on('end', async reason => {
				if (reason === 'Stream is not generating quickly enough.');
				serverQueue.songs.shift('Stream is not generating quickly enough');
				await play(guild, serverQueue.songs[0]);
			})
			.on('error', error => console.error(error));
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

		const vote = {
			users: []
		};
		skipvote.set(msg.guild.id, vote);

		const duration = lang.play_duration.replace('%duration', song.duration);
				const published = lang.play_published.replace('%publishedatdate', song.publishedat);
				const embed = new Discord.RichEmbed()
				.setAuthor(lang.play_startplaying)
				.setDescription(duration)
				.setThumbnail(song.thumbnail)
				.setColor('#009900')
				.setURL(song.url)
				.setFooter(published)
				.setTitle(song.title);

				return msg.channel.send({ embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: [], dashboardsettings: true
};

exports.help = {
	name: 'play',
	description: 'Searches for music that matches to your request',
	usage: 'play {query}',
	example: ['play Gangnam Style'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK']
};