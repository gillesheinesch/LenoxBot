const { Command } = require('klasa');
const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const config = require('../../settings.json');
const moment = require('moment');
require('moment-duration-format');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(config.googlekey);

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PLAY_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_PLAY_EXTENDEDHELP'),
			usage: '<query:str>',
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK']
		});
	}

	async run(message, [query]) {
		const music_settings = message.guildSettings.get('music');
		const langSet = message.client.provider.getGuild(message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const queue = message.client.queue;
		const skipvote = message.client.skipvote;
		const input = message.content.split(' ');
		const searchString = input.slice(1).join(' ');
		const url = input[1] ? input[1].replace(/<(.+)>/g, '$1') : '';
		moment.locale(message.client.provider.getGuild(message.guild.id, 'momentLanguage'));

		const voice_channel = message.member.voice.channel;
		if (!voice_channel) return message.channel.send(lang.play_notvoicechannel);

		/* Planned Removal */
		for (let i = 0; i < message.client.provider.getGuild(message.guild.id, 'musicchannelblacklist').length; i++) {
			if (voiceChannel.id === message.client.provider.getGuild(message.guild.id, 'musicchannelblacklist')[i]) return message.reply(lang.play_blacklistchannel);
		}
		/* Planned Removal */

		const executeQueue = ((queue) => {
			const voice_connection = message.guild.voice.connection;
			const current_audio = queue[0];
			// If the queue is empty
			if (queue.length <= 0) {
				message.channel.send('<:check:411976443522711552> Playback finished.');
				if (voice_connection) return voice_connection.disconnect(); // Leave the voice channel.
			}
			
			new Promise((resolve, reject) => {
				// Join the voice channel if not already in one.
				if (!voice_connection) {
					if (!voice_channel) return message.channel.send('<:redx:411978781226696705> You must be in a voice channel!');
					// Check if the user is in a voice channel.
					if (voice_channel && voice_channel.joinable) {
						voice_channel.join().then((connection) => {
							resolve(connection);
						}).catch((error) => {
							return console.error(error.stack ? error.stack : error.toString());
						});
					} else if (!voice_channel.joinable) {
						if (voice_channel.full) {
							message.channel.send('<:redx:411978781226696705> I do not have permission to join your voice channel; it is full.');
						} else {
							message.channel.send('<:redx:411978781226696705> I do not have permission to join your voice channel!');
						}
						reject();
					} else {
						// Otherwise, clear the queue and do nothing.
						queue.length = 0;
						reject();
					}
				} else {
					resolve(voice_connection);
				}
			}).then((connection) => {
				const video = current_audio.url; // Get the audio to play from the queue.
				
				// Play the video.
				try {
					music_settings.is_streaming = false;
					
					if (!video) return message.channel.send('<:redx:411978781226696705> I was unable to play that video.');
					
					const dispatcher =/*!music_settings.stream_mode ?*/ connection.play(ytdl(video.toString(), { filter: 'audioonly' }), { volume: music_settings.volume / 100 });

					connection.once('failed', (reason) => {
						console.error(reason.toString());
						try {
							if (connection) connection.disconnect();
						} catch (err) {
							console.error(err.toString());
						};
					});
					
					connection.once('error', (err) => {
						// Skip to the next song.
						console.error(`Dispatcher/connection: ${err.stack ? err.stack : err.toString()}`);
						if (message && message.channel) message.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${err.toString()}\``);
						if (queue.length > 0) {
							if (music_settings.loop && !current_audio.repeat) {
								queue.push(queue.shift()); // Push first item to end
							} else if (!music_settings.loop && current_audio.repeat) {
								// do nothing
							} else {
								queue.shift(); // Skip to the next song.
							}
						}
						executeQueue(queue);
					});
					
					dispatcher.once('error', (err) => {
						console.error(`Dispatcher: ${err.stack ? err.stack : err.toString()}`);
						if (message && message.channel) message.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${err.toString()}\``);
						if (queue.length > 0) {
							if (music_settings.loop && !current_audio.repeat) {
								queue.push(queue.shift()); // Push first item to end
							} else if (!music_settings.loop && current_audio.repeat) {
								// do nothing
							} else {
								queue.shift(); // Skip to the next song.
							}
						}
						executeQueue(queue);
					});
					
					dispatcher.once('end', () => {
						// Wait a second before continuing
						setTimeout(() => {
							if (queue.length > 0) {
								if (music_settings.loop && !current_audio.repeat) {
									queue.push(queue.shift()); // Push first item to end
								} else if (!music_settings.loop && current_audio.repeat) {
									// do nothing
								} else {
									queue.shift(); // Skip to the next song.
								}
							}
							executeQueue(queue);
						}, 1000);
					});
				} catch (err) {
					return console.error(err.stack ? err.stack : err.toString());
				};
			}).catch((err) => {
				return console.error(err.stack ? err.stack : err.toString());
			});
		});





		async function play(guild, song) {
			const serverQueue = await queue.get(guild.id);

			if (!song) {
				await serverQueue.voiceChannel.leave();
				await queue.delete(guild.id);
				return;
			}

			const stream = await ytdl(song.url, {
				filter: 'audioonly'
			});
			const dispatcher = await serverQueue.connection.play(stream)
				.on('end', async reason => {
					if (reason === 'Stream is not generating quickly enough.');
					if (serverQueue.songs[0].repeat) serverQueue.songs.unshift(serverQueue.songs.shift('Stream is not generating quickly enough'));
					else if (serverQueue.loop) serverQueue.songs.push(serverQueue.songs.shift('Stream is not generating quickly enough'));
					else serverQueue.songs.shift('Stream is not generating quickly enough');
					await play(guild, serverQueue.songs[0]);
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

			const vote = {
				users: []
			};
			skipvote.set(message.guild.id, vote);

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

			return message.channel.send({
				embed
			});
		}

		async function handleVideo(video, playlist) {
			const serverQueue = queue.get(message.guild.id);
			const song = {
				duration: moment.duration(video.duration).format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`),
				thumbnail: video.thumbnails.default.url,
				publishedat: video.publishedAt,
				id: video.id,
				repeat: false,
				title: Util.escapeMarkdown(video.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
					.replace(/&quot;/g, '"')
					.replace(/&OElig;/g, 'Œ')
					.replace(/&oelig;/g, 'œ')
					.replace(/&Scaron;/g, 'Š')
					.replace(/&scaron;/g, 'š')
					.replace(/&Yuml;/g, 'Ÿ')
					.replace(/&circ;/g, 'ˆ')
					.replace(/&tilde;/g, '˜')
					.replace(/&ndash;/g, '–')
					.replace(/&mdash;/g, '—')
					.replace(/&lsquo;/g, '‘')
					.replace(/&rsquo;/g, '’')
					.replace(/&sbquo;/g, '‚')
					.replace(/&ldquo;/g, '“')
					.replace(/&rdquo;/g, '”')
					.replace(/&bdquo;/g, '„')
					.replace(/&dagger;/g, '†')
					.replace(/&Dagger;/g, '‡')
					.replace(/&permil;/g, '‰')
					.replace(/&lsaquo;/g, '‹')
					.replace(/&rsaquo;/g, '›')
					.replace(/&euro;/g, '€')
					.replace(/&copy;/g, '©')
					.replace(/&trade;/g, '™')
					.replace(/&reg;/g, '®')
					.replace(/&nbsp;/g, ' ')),
				url: `https://www.youtube.com/watch?v=${video.id}`
			};

			if (moment.duration(video.duration).format('m') > 30 && message.client.provider.getUser(message.author.id, 'premium').status === false) return message.reply(lang.play_songlengthlimit);

			if (serverQueue) {
				if (serverQueue.songs.length > 8 && message.client.provider.getGuild(message.guild.id, 'premium').status === false) return message.reply(lang.play_limitreached);
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

				return message.channel.send({
					embed
				});
			} else {
			/* eslint no-else-return: 0 */
				const queueConstruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 2,
					playing: true
				};
				await queue.set(message.guild.id, queueConstruct);

				await queueConstruct.songs.push(song);

				const vote = {
					users: []
				};

				skipvote.set(message.guild.id, vote);

				try {
					const connection = await voiceChannel.join();
					queueConstruct.connection = connection;
					await play(message.guild, queueConstruct.songs[0]);
				} catch (error) {
					console.log(error);
					await queue.delete(message.guild.id);
					await skipvote.delete(message.guild.id);
					return message.channel.send(lang.play_errorjoin);
				}
			}
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			const serverQueue = queue.get(message.guild.id);

			if ((Object.keys(videos).length + (serverQueue ? serverQueue.songs.length : 0)) > 8 && message.client.provider.getGuild(message.guild.id, 'premium').status === false) return message.reply(lang.play_limitreached);

			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, true);
			}
			const playlistadded = lang.play_playlistadded.replace('%playlisttitle', `**${playlist.title}**`);
			return message.channel.send(playlistadded);
		}
		let video;
		try {
			video = await youtube.getVideo(url);
		} catch (error) {
			try {
				const videos = await youtube.searchVideos(searchString, 10);

				if (videos.length === 0) return message.channel.send(lang.play_noresult);

				let index = 0;
				const embed = new Discord.MessageEmbed()
					.setColor('#7BB3FF')
					.setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
						.replace(/&quot;/g, '"')
						.replace(/&OElig;/g, 'Œ')
						.replace(/&oelig;/g, 'œ')
						.replace(/&Scaron;/g, 'Š')
						.replace(/&scaron;/g, 'š')
						.replace(/&Yuml;/g, 'Ÿ')
						.replace(/&circ;/g, 'ˆ')
						.replace(/&tilde;/g, '˜')
						.replace(/&ndash;/g, '–')
						.replace(/&mdash;/g, '—')
						.replace(/&lsquo;/g, '‘')
						.replace(/&rsquo;/g, '’')
						.replace(/&sbquo;/g, '‚')
						.replace(/&ldquo;/g, '“')
						.replace(/&rdquo;/g, '”')
						.replace(/&bdquo;/g, '„')
						.replace(/&dagger;/g, '†')
						.replace(/&Dagger;/g, '‡')
						.replace(/&permil;/g, '‰')
						.replace(/&lsaquo;/g, '‹')
						.replace(/&rsaquo;/g, '›')
						.replace(/&euro;/g, '€')
						.replace(/&copy;/g, '©')
						.replace(/&trade;/g, '™')
						.replace(/&reg;/g, '®')
						.replace(/&nbsp;/g, ' ')}`).join('\n')}`)
					.setAuthor(lang.play_songselection, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');

				const embed2 = new Discord.MessageEmbed()
					.setColor('#0066CC')
					.setDescription(lang.play_value);
				message.channel.send({
					embed
				});
				message.channel.send({
					embed: embed2
				});

				let response;
				try {
					response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11 && message.author.id === msg2.author.id, {
						max: 1,
						time: 20000,
						errors: ['time']
					});
				} catch (err) {
					return message.channel.send(lang.play_error);
				}
				const videoIndex = parseInt(response.first().content, 10);
				video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			} catch (err) {
				return message.channel.send(lang.play_noresult);
			}
		}
		handleVideo(video, false);
	}

};
