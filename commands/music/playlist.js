const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const config = require('../../settings.json');
	const ytdl = require('ytdl-core');
	const {
		Util
	} = require('discord.js');
	const moment = require('moment');
	require('moment-duration-format');
	const YouTube = require('simple-youtube-api');
	const youtube = new YouTube(config.googlekey);
	const validation = ['new', 'delete', 'list', 'addsong', 'removesong'];
	const margs = msg.content.split(" ");
	var newplaylisttitle = '';
	var newplaylistsongs = [];

	// Guild premium check
	// Song premium check if length is < 30 min
	// Check content length if new playlist title is created

	for (var i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'new') {
				if (Object.keys(tableload.playlist).length >= 8) return msg.reply('Currently you can just add 8 playlists!');

				await msg.reply('What should be the title of the new playlist? (under 30 characters)');
				try {
					var responsetitle = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 10000,
						errors: ['time']
					});
					newplaylisttitle = responsetitle.first().content;
				} catch (err) {
					return msg.channel.send('Time error');
				}

				if (tableload.playlist[responsetitle.first().content.toLowerCase()]) return msg.reply('Playlist already existed!');

				await msg.reply(`Which song should be added in the playlist (**${newplaylisttitle}**)? \n(Type in "finish" if you have finished adding songs to your playlist)`);
				for (var i = 0; i < 100; i++) {
					try {
						var responsesongs = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id, {
							maxMatches: 1,
							time: 50000,
							errors: ['time']
						});

						if (responsesongs.first().content.toLowerCase() === 'finish') {
							tableload.playlist[newplaylisttitle.toLowerCase()] = newplaylistsongs;
							await client.guildconfs.set(msg.guild.id, tableload);
							return msg.reply('Playlist finished and saved!');
						}

						const url = responsesongs.first().content ? responsesongs.first().content.replace(/<(.+)>/g, '$1') : '';
						if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
							const playlist = await youtube.getPlaylist(url);
							const videos = await playlist.getVideos();
							for (const video of Object.values(videos)) {
								const video2 = await youtube.getVideoByID(video.id);
							}
							await responsesongs.delete();
							var playlistadded = lang.play_playlistadded.replace('%playlisttitle', `**${playlist.title}**`);
							msg.channel.send('Song added!');
						} else {
							try {
								var video = await youtube.getVideo(url);
							} catch (error) {
								try {
									const searchString = responsesongs.first().content;
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
									const firstmessage = await msg.channel.send({
										embed
									});
									const secondmessage = await msg.channel.send({
										embed: embed2
									});
									try {
										var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11 && msg.author.id === msg2.author.id, {
											maxMatches: 1,
											time: 50000,
											errors: ['time']
										});
									} catch (err) {
										return msg.channel.send('time error');
									}
									const videoIndex = parseInt(response.first().content);
									var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
									await firstmessage.delete();
									await secondmessage.delete();
									newplaylistsongs.push(video);

									if (newplaylistsongs.length === 12) {
										tableload.playlist[newplaylisttitle.toLowerCase()] = newplaylistsongs;
										await client.guildconfs.set(msg.guild.id, tableload);
										console.log(tableload.playlist);
										return msg.reply('playlist saved');
									} else {
										msg.reply('Song has been added to the new playlist! Enter a next title to enter a new song');
									}

									console.log(Util.escapeMarkdown(video.title));
								} catch (err) {
									return msg.channel.send('No result');
								}
							}
						}
					} catch (err) {
						console.log(err);
						return msg.channel.send('Time error');
					}
				}

			} else if (margs[1].toLowerCase() === 'list') {
				if (Object.keys(tableload.playlist).length === 0) return msg.reply('No playlist added yet!');

				if (args.slice(1).length !== 0 && args.slice(1) !== '') {
					const input = args.slice(1);

					if (!tableload.playlist[input.join(" ").toLowerCase()]) return msg.reply('Playlist doesn\'t exist!');

					const listsongplaylist = new Discord.RichEmbed()
						.setAuthor('All songs in this playlist:')
						.setColor('#66ff33');

					const songtitlearray = [];
					for (var x in tableload.playlist[input.join(" ").toLowerCase()]) {
						songtitlearray.push(tableload.playlist[input.join(" ").toLowerCase()][x].title);
					}

					listsongplaylist.setDescription(`${songtitlearray.join("\n")}`);

					return msg.channel.send({
						embed: listsongplaylist
					});
				}
				var listplaylistobject = [];
				const listplaylistembed = new Discord.RichEmbed()
					.setAuthor('All playlists:')
					.setColor('#66ff33');

				for (var x in tableload.playlist) {
					listplaylistobject.push(x);
				}

				listplaylistembed.setDescription(`${listplaylistobject.join("\n")}`)

				return msg.channel.send({
					embed: listplaylistembed
				});
			} else if (margs[1].toLowerCase() === 'delete') {
				if (!tableload.playlist[args.slice(1).join(" ").toLowerCase()]) return msg.reply('Playlist doesn\'t exist');

				delete tableload.playlist[args.slice(1).join(" ").toLowerCase()];
				await client.guildconfs.set(msg.guild.id, tableload);

				return msg.reply('Deleted playlist');
			}
		}
	}

	return msg.reply('Command incorrectly used!');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'playlist',
	description: '',
	usage: '',
	example: [''],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
