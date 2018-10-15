exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const userdb = client.userdb.get(msg.author.id);
	const skipvote = client.skipvote;
	const queue = client.queue;
	const moment = require('moment');
	require('moment-duration-format');
	const serverQueue = await queue.get(msg.guild.id);
	const voiceChannel = msg.member.voiceChannel;
	const Discord = require('discord.js');
	const ytdl = require('ytdl-core');
	const {
		Util
	} = require('discord.js');
	moment.locale(tableload.momentLanguage);

	if (tableload.premium.status === false) return msg.reply(lang.playlist_noguildpremium);
	if (args.slice().length === 0 || !args) return msg.reply(lang.playplaylist_error);
	if (!tableload.playlist[args.slice().join(' ').toLowerCase()]) return msg.reply(lang.playlist_playlistnotexist);

	if (!voiceChannel) return msg.channel.send(lang.play_notvoicechannel);

	for (let i = 0; i < tableload.musicchannelblacklist.length; i++) {
		if (voiceChannel.id === tableload.musicchannelblacklist[i]) return msg.reply(lang.play_blacklistchannel);
	}

	if (serverQueue) {
		if ((serverQueue.songs.length + Object.keys(tableload.playlist[args.slice().join(' ').toLowerCase()]).length) > 8 && tableload.premium.status === false) return msg.reply(lang.play_limitreached);
	}

	async function play(guild, song) {
		if (!song) {
			await serverQueue.voiceChannel.leave();
			await queue.delete(guild.id);
			return;
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

		if (moment.duration(video.duration).format('m') > 30 && userdb.premium.status === false) return msg.reply(lang.play_songlengthlimit);

		if (serverQueue) {
			await serverQueue.songs.push(song);
			if (playlist) return;

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

			return msg.channel.send({
				embed: embed
			});
		} else {
			/* eslint no-else-return: 0 */
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
				const connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				await play(msg.guild, queueConstruct.songs[0]);
			} catch (error) {
				await queue.delete(msg.guild.id);
				await skipvote.delete(msg.guild.id);
				return msg.channel.send(lang.play_errorjoin);
			}
		}
	}
	/* eslint guard-for-in: 0 */
	for (const song in tableload.playlist[args.slice().join(' ').toLowerCase()]) {
		const video = tableload.playlist[args.slice().join(' ').toLowerCase()][song];
		await handleVideo(video, msg, voiceChannel);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Musicplayersettings',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'playplaylist',
	description: 'Plays a music playlist',
	usage: 'playplaylist {name of the playlist}',
	example: ['playplaylist DJKhaled-Playlist'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
