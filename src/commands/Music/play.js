const Command = require("../../lib/LenoxCommand");
const { Util: { escapeMarkdown } } = require('discord.js');
const ytdl = require('ytdl-core');
const youtubeInfo = require("youtube-info");
const ytlist = require("youtube-playlist");
const crawl = require('youtube-crawl');
const axios = require('axios');
const parseMilliseconds = require('parse-ms');
const moment = require('moment');
require('moment-duration-format');




/*const config = require('../../settings.json');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(config.googlekey);*/

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: language => language.get('COMMAND_PLAY_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_PLAY_EXTENDEDHELP'),
			usage: '<query:str>',
			requiredPermissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK'],
			userPermissions: ['CONNECT']
		});
	}

	async run(message, [query]) {
		const music_settings = message.guildSettings.get('music');
		const premium = message.guildSettings.get('premium.status');
		//const skipvote = message.client.skipvote;
		//const url = input[1] ? input[1].replace(/<(.+)>/g, '$1') : '';
		moment.locale(message.guildSettings.get('momentLanguage'));
		
		const getVoiceChannel = (() => {
			return message.member.voice.channel;
		});
		
		const getVoiceConnection = (() => {
			return message.guild.voice ? message.guild.voice.connection : null;
		});

		if (!getVoiceChannel()) return message.channel.sendLocale('MUSIC_NOTINVOICECHANNEL');

		/* Planned Removal */
		/*for (let i = 0; i < message.client.provider.getGuild(message.guild.id, 'musicchannelblacklist').length; i++) {
			if (voiceChannel.id === message.client.provider.getGuild(message.guild.id, 'musicchannelblacklist')[i]) return message.reply(lang.play_blacklistchannel);
		}*/
		/* Planned Removal */

		const regexes = {
			youtube: /(?:(?:https?\:\/\/)?(?:w{1,4}\.)?youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=)|playlist\/?\?(?:\S*?&?list\=))|youtu\.be\/)([A-z0-9_-]{6,34})/i,
			youtube_playlist: /(?:(?:https?\:\/\/)?(?:w{1,4}\.)?youtube\.com\/\S*(?:playlist\/?\?(?:\S*?&?list\=))|youtu\.be\/)([A-z0-9_-]{20,34})/i
		}
		
		const nowPlaying = (async(audio = {}) => {
			/*const embed = new MessageEmbed()
				.setColor(3447003)
				.setTitle(audio.owner ? `${audio.title ? audio.title.replace(/\&quot;/g, '"') : 'N/A'} by ${audio.owner}` : audio.title ? audio.title.replace(/\&quot;/g, '"') : 'N/A')
				.setURL(audio.url)
				.setTimestamp()

			if (audio.thumbnailUrl) embed.setThumbnail(audio.thumbnailUrl);
			if (audio.description) embed.setDescription(String.truncate(audio.description, 2048))
			return await message.channel.send(embed);*/
			const { hours, minutes, seconds } = parseMilliseconds(audio.duration);
			return await message.channel.send({
				embed: {
					title: audio.title ? audio.title.replace(/\&quot;/g, '"') : message.language.get('MUSIC_UNKNOWNTITLETITLE'),
					url: audio.url,
					color: 3447003,
					thumbnail: {
						url: audio.thumbnailUrl
					},
					author: {
						name: audio.owner,
						url: audio.channelUrl,
						icon_url: audio.channelThumbnailUrl
					},
					description: [
						`**${message.language.get('MUSIC_DURATIONDESCRIPTION')}**: \`${audio.duration === Infinity ? 'Infinity' : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}\``
					].join('\n'),
					timestamp: new Date(),
					footer: {
						text: message.language.get('MUSIC_NOWPLAYINGFOOTER')
					}
				}
			});
		});

		const executeQueue = (async(queue) => {
			const current_audio = queue[0];
			if (!queue.length) { // If the queue is empty
				if (getVoiceConnection()) getVoiceConnection().disconnect(); // Leave the voice channel.
				return message.channel.sendLocale('MUSIC_PLAYBACKFINISHED');
			} else {
				try {
					await nowPlaying(current_audio);
				} catch (e) {
					throw e;
				}
				//if (voice_connection) return;
			}

			new Promise((resolve, reject) => {
				// Join the voice channel if not already in one.
				if (!getVoiceConnection()) {
					if (!getVoiceChannel()) return message.channel.sendLocale('MUSIC_NOTINVOICECHANNEL');
					// Check if the user is in a voice channel.
					if (getVoiceChannel() && getVoiceChannel().joinable) {
						getVoiceChannel().join().then((connection) => {
							resolve(connection);
						}).catch((error) => {
							return console.error(error.stack ? error.stack : error.toString());
						});
					} else if (!getVoiceChannel().joinable) {
						if (getVoiceChannel().full) {
							message.channel.sendLocale('MUSIC_VOICECHANNELFULL');
						} else {
							message.channel.sendLocale('MUSIC_JOINVOICECHANNELNOPERMS');
						}
						reject();
					} else {
						// Otherwise, clear the queue and do nothing.
						queue.length = 0;
						reject();
					}
				} else {
					resolve(getVoiceConnection());
				}
			}).then((connection) => {
				// Play the video.
				try {
					if (!current_audio) return message.channel.sendLocale('MUSIC_UNABLETOPLAYAUDIO');
					
					const dispatcher =/*!music_settings.stream_mode ?*/ connection.play(ytdl.validateURL(current_audio.url) ? ytdl(current_audio.url, { filter: 'audioonly' }) : current_audio.url, { volume: music_settings.volume / 100 });

					connection.once('failed', (reason) => {
						console.error(`Connection failed: ${reason.toString()}`);
						if (message && message.channel) message.channel.send(reason.toString());
						try {
							if (connection) connection.disconnect();
						} catch (err) {
							console.error(err.toString());
						};
					});
					
					connection.once('error', (err) => {
						console.error(`Connection error: ${err.stack ? err.stack : err.toString()}`);
						if (message && message.channel) message.channel.sendLocale('MUSIC_CONNECTIONERROR', [err.toString()]);
						if (queue.length) {
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

					/*connection.once('disconnect', () => {
						//
					});*/
					
					dispatcher.once('error', (err) => {
						console.error(`Dispatcher error: ${err.stack ? err.stack : err.toString()}`);
						if (message && message.channel) message.channel.sendLocale('MUSIC_DISPATCHERERROR', [err.toString()]);
						if (queue.length) {
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
							if (queue.length && !current_audio.isStream) {
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

		const pushToQueue = ((options = {}, { is_playlist, is_stream } = { is_playlist: false, is_stream: false }) => {
			const audio_info = {
				channelUrl: options.channelId ? "https://www.youtube.com/channel/" + options.channelId : undefined,
				channelThumbnailUrl: options.channelThumbnailUrl || undefined,
				description: options.description || undefined,
				duration: is_stream ? Infinity : (options.duration * 1000 || 0),
				genre: options.genre || undefined,
				isStream: is_stream,
				owner: options.owner || undefined,
				repeat: false,
				requester: message.author,
				skipvotes: [],
				thumbnailUrl: options.thumbnailUrl || undefined,
				title: options.title ? escapeMarkdown(options.title.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&OElig;/g, 'Œ').replace(/&oelig;/g, 'œ').replace(/&Scaron;/g, 'Š').replace(/&scaron;/g, 'š').replace(/&Yuml;/g, 'Ÿ').replace(/&circ;/g, 'ˆ').replace(/&tilde;/g, '˜').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’').replace(/&sbquo;/g, '‚').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&bdquo;/g, '„').replace(/&dagger;/g, '†').replace(/&Dagger;/g, '‡').replace(/&permil;/g, '‰').replace(/&lsaquo;/g, '‹').replace(/&rsaquo;/g, '›').replace(/&euro;/g, '€').replace(/&copy;/g, '©').replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&nbsp;/g, ' ')) : undefined,
				url: decodeURIComponent(options.url),
				videoId: options.videoId || undefined
			};
			if (music_settings.queue.length && !premium) {
				if ((music_settings.queue.length + 1) > 8) return message.reply(message.language.get('COMMAND_PLAY_QUEUELIMIT_REACHED'));
				let duration = 0;
				music_settings.queue.map((audio) => duration += audio.duration);
				if (parseMilliseconds(duration).minutes >= 30 || (parseMilliseconds(duration) + parseMilliseconds(audio_info.duration).minutes) >= 30) return message.reply(message.language.get('COMMAND_PLAY_SONGLENGTHLIMIT'));
			}
			if (music_settings.queue.length > 1 && is_stream) music_settings.queue.length = 0;
			music_settings.queue.push(audio_info);
			if (music_settings.queue.length > 1 && is_stream && getVoiceConnection()) getVoiceConnection().dispatcher.end();
			if (music_settings.queue.length === 1 || is_playlist) return;
			const { hours, minutes, seconds } = parseMilliseconds(audio_info.duration);
			return message.channel.send({
				embed: {
					title: audio_info.title ? audio_info.title.replace(/\&quot;/g, '"') : message.language.get('MUSIC_UNKNOWNTITLETITLE'),
					url: audio_info.url,
					color: 3447003,
					thumbnail: {
						url: audio_info.thumbnailUrl
					},
					author: {
						name: audio_info.owner,
						url: audio_info.channelUrl,
						icon_url: audio_info.channelThumbnailUrl
					},
					description: [
						`**${message.language.get('MUSIC_DURATIONDESCRIPTION')}**: \`${audio_info.duration === Infinity ? 'Infinity' : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}\``
					].join('\n'),
					timestamp: new Date(),
					footer: {
						text: message.language.get('MUSIC_ADDEDTOQUEUEFOOTER')
					}
				}
			});
		});

		const isValidURL = (async (url) => {
			try {
				await axios.get(url);
				return true;
			} catch (error) {
				return false;
			}
		});

		const getYoutubeVideoInfo = (async (video_id, playlist = false) => {
			try {
				return await youtubeInfo(video_id);
			} catch (e) {
				if (!playlist) throw e.message; // ignore error if retrieving from playlist otherwise the playlist array will include rejected promises
			}
		});

		const getYoutubePlaylistVideos = (async (playlist_url) => {
			try {
				const videos = await ytlist(playlist_url, "id");
				return await Promise.all(videos.data.playlist.map((id) => getYoutubeVideoInfo(id, true)));
			} catch (error) {
				throw error.message;
			}
		});

		const promptVideoSelect = (async (queue) => {
			if (queue.length > 6) queue.splice(6, queue.length);
			let results = '';
			await queue.map((video, index) => results += `\n${index + 1}. [${video.title}](${video.uri})`);
			if (queue.length > 1) {
				await message.prompt({
					embed: {
						color: 0x43B581,
						description: message.language.get('MULTIPLE_ITEMS_FOUND_PROMPT', results)
					}
				}).then(async(choices) => {
					if (choices.content.toLowerCase() === message.language.get('ANSWER_CANCEL_PROMPT') || !parseInt(choices.content)) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					const answer = queue[parseInt(choices.content) - 1];
					if (parseInt(choices.content) - 1 < 0 || parseInt(choices.content) - 1 > queue.length - 1) return message.sendLocale('MESSAGE_PROMPT_CANCELED');
					return await getYoutubeVideoInfo(ytdl.getVideoID(answer.uri));
				}).catch(console.error);
			} else if (queue.length === 1) {
				return await getYoutubeVideoInfo(ytdl.getVideoID(queue[0].uri));
			}
		});

		const searchForYoutubeVideo = (async (query) => {
			try {
				const videos = await crawl(query).filter((video) => video.title && video.uri && ytdl.validateURL(video.uri));
				if (!videos.length) throw message.language.get('MUSIC_UNABLETOFINDVIDEO');
				return await promptVideoSelect(videos);
			} catch (error) {
				throw error.message;
			}
		});
		
		if ((ytdl.validateURL(query) || ytdl.validateID(query)) && !query.includes(' ')) { // youtube video
			/**
			 * @property { videoId, url, title, description, owner, channelId, thumbnailUrl, embedURL, datePublished, genre, paid, unlisted, isFamilyFriendly, duration, views, regionsAllowed, dislikeCount, likeCount, channelThumbnailUrl, commentCount }
			*/
			pushToQueue(await getYoutubeVideoInfo(ytdl.getVideoID(query)));
		} else if ((regexes.youtube_playlist.test(query) || (query.length >= 20 && query.length <= 34)) && !query.includes(' ') && decodeURIComponent(query).includes('/playlist?list=')) { // youtube playlist
			//if (!/^(https?\:\/\/)?(w{1,4}\.)?youtube\.com\/\S*(?:playlist\/?\?(?:\S*?&?list\=))/i.test(query) && query.length >= 20 && query.length <= 34) query = `https://www.youtube.com/playlist?list=${query}`;
			message.send({ embed: { description: message.language.get('LOADING_MESSAGE'), color: 7506394 } });
			const videos = (await getYoutubePlaylistVideos(query)).map((info) => pushToQueue(info, { is_playlist: true }));
			message.send({ embed: { description: message.language.get('MUSIC_ADDEDNUMITEMSTOQUEUE', videos.length), color: 7506394 } });
		} else if (!query.includes(' ') && await isValidURL(encodeURIComponent(query))) { // radio stream
			pushToQueue({ url: query, duration: Infinity }, { is_stream: true });
		} else { // play from stream [only supports youtube currently]
			if (query.toLowerCase().startsWith('yt:')) pushToQueue(await searchForYoutubeVideo(query.replace(/^yt\:/i, ''))); // if query starts with `yt:` search for youtube video
			else pushToQueue(await searchForYoutubeVideo(query)); // if none match default to youtube
			// search for builtin radio name or youtube video
			//otherwise it's a search query for youtube
		}

		if (music_settings.queue.length === 1 || !getVoiceConnection()) await executeQueue(music_settings.queue);



// extra code to look through later
		/*
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
				handleVideo(video, false);*/
	}

}