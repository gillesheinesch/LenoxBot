const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const api = client.newsapi;
	var index = 0;
	var margs = msg.content.split(" ");

	const validationofnewspaper = ['abc-news-au', 'al-jazeera-english', 'ars-technica', 'associated-press', 'bbc-news', 'bbc-sport', 'bild', 'bloomberg', 'breitbart-news', 'business-insider', 'business-insider-uk', 'buzzfeed', 'cnbc', 'cnn', 'daily-mail', 'der-tagesspiegel', 'die-zeit', 'engadget'];
	
	var newsnotexist = lang.news_newsnotexist.replace('%newslist', validationofnewspaper.join(', '));
	var newspaper = new Discord.RichEmbed()
	.setDescription(newsnotexist)
	.setColor('#76c65d');

	if (!margs[1]) return msg.channel.send({ embed: newspaper });
	for (var i = 0; i < margs.length; i++) {
		if (validationofnewspaper.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'bild') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'abc-news-au') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'al-jazeera-english') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'ars-technica') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'associated-press') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'bbc-news') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'bbc-sport') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'ars-technica') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'bloomberg') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'breitbart-news') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'business-insider') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'business-insider-uk') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'buzzfeed') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'cnbc') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'cnn') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'daily-mail') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'der-tagesspiegel') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'latest'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'die-zeit') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'latest'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			} else if (margs[1].toLowerCase() === 'engadget') {
				const r = await api.articles({
					source: margs[1],
					sortBy: 'top'
				});
				var embed = new Discord.RichEmbed()
					.setColor('#76c65d')
					.setDescription(r.articles.map(article => `**${++index} -** ${article.title}`).join('\n'));
				msg.channel.send({
					embed
				});
				try {
					var response1 = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg.author.id === msg2.author.id, {
						maxMatches: 1,
						time: 20000,
						errors: ['time']
					});
					try {
						var embed2 = new Discord.RichEmbed()
							.setAuthor(r.articles[response1.first().content - 1].author !== null ? r.articles[response1.first().content - 1].author : lang.news_noauthor)
							.setURL(r.articles[response1.first().content - 1].url)
							.setColor('#76c65d')
							.setDescription(r.articles[response1.first().content - 1].description !== null ? r.articles[response1.first().content - 1].description : lang.news_nodescription)
							.setImage(r.articles[response1.first().content - 1].urlToImage)
							.setFooter(`${r.source.toUpperCase()} || ${r.articles[response1.first().content - 1].publishedAt !== null ? r.articles[response1.first().content - 1].publishedAt : lang.news_nopubdate}`);
						return msg.channel.send({
							embed: embed2
						});
					} catch (error) {
						return msg.channel.send(lang.news_articlenotexist);
					}
				} catch (error) {
					return msg.channel.send(lang.news_noanswer);
				}
			}
		}
	}
	msg.channel.send({ embed: newspaper });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],

    

    userpermissions: [], dashboardsettings: true

};
exports.help = {
	name: 'news',
	description: 'Use this command to request news from different newspaper',
	usage: 'news {newspaper}',
	example: ['news bild'],
	category: 'searches',
    botpermissions: ['SEND_MESSAGES']
};
