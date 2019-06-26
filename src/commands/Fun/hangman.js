const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { JSDOM } = require('jsdom');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			description: 'Play hangman alone or with your Discord friends',
			extendedHelp: [
				'hangman',
				'hangman @Tester#0001'
			].join('\n'),
			usage: '[GuildMember:member]',
			aliases: ['hg'],
			requiredPermissions: ['SEND_MESSAGES']
		});
	}

	async run(message, [member]) {
		let embedtitlechances;
		let chances = 15;
		const triedLetters = [];
		const hangmanPictures = [
			'https://imgur.com/Ad5vgPD.png',
			'https://imgur.com/jxPXvDP.png',
			'https://imgur.com/M6rbN9m.png',
			'https://imgur.com/KFEHYJG.png',
			'https://imgur.com/fcEsw9A.png',
			'https://imgur.com/S3bBIhl.png',
			'https://imgur.com/gwS4ohM.png',
			'https://imgur.com/RZQCq21.png',
			'https://imgur.com/Py8zHOx.png',
			'https://imgur.com/ikOBjSm.png',
			'https://imgur.com/jSlG4cf.png',
			'https://imgur.com/wsxb7Uq.png',
			'https://imgur.com/bVsUfP3.png',
			'https://imgur.com/Mwzwp6i.png',
			'https://imgur.com/qltUWtL.png',
			'https://imgur.com/vWoekpB.png'
		];

		//
		const wordToGuess = (await JSDOM.fromURL('https://randomword.com')).window.document.getElementById('random_word').textContent;
		const wordToGuessInArray = wordToGuess.split('');

		const newWordString = [];
		for (let i = 0; i < wordToGuess.length; i++) {
			newWordString.push('_');
		}

		if (member) {
			const questionMessage = await message.channel.send(message.language.get('COMMAND_HANGMAN_MENTIONPLAYQUESTION', member, message.author));

			await questionMessage.react('👍');
			await questionMessage.react('👎');

			const collector = questionMessage.createReactionCollector((reaction, user) => user.id === member.id, {
				time: 120000
			});
			collector.on('collect', async r => {
				if (r.emoji.name === '👍') {
					await questionMessage.delete();

					embedtitlechances = message.language.get('COMMAND_HANGMAN_EMBEDTITLECHANCES', chances);
					const embeddescription = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTION', `\`\`${newWordString.join(' ')}\`\``);
					const firstEmbed = new MessageEmbed()
						.setColor('BLUE')
						.setTitle(message.language.get('COMMAND_HANGMAN_EMBEDTITLESTART'))
						.setFooter(embedtitlechances)
						.setImage(hangmanPictures[15 - chances])
						.setDescription(embeddescription);

					const hangmanEmbed = await message.channel.send({
						embed: firstEmbed
					});

					let msg;
					let response;

					let turn = 1;

					for (let i = 0; i < 1000; i++) {
						try {
							if (msg) {
								await msg.delete();
								await response.first().delete();
							}

							if (turn === 1) {
								const letterorwordmessage = message.language.get('COMMAND_HANGMAN_LETTERORWORDMESSAGE', message.author);
								msg = await message.channel.send(letterorwordmessage);
								response = await message.channel.awaitMessages(msg2 => message.author.id === msg2.author.id, {
									max: 1,
									time: 180000,
									errors: ['time']
								});
							} else {
								const letterorwordmessage = message.language.get('COMMAND_HANGMAN_LETTERORWORDMESSAGE', member);
								msg = await message.channel.send(letterorwordmessage);
								response = await message.channel.awaitMessages(msg2 => member.id === msg2.author.id, {
									max: 1,
									time: 180000,
									errors: ['time']
								});
							}

							if (response.first().content.toLowerCase().match(/[a-z]/i)) {
								// eslint-disable-next-line no-negated-condition
								if (!triedLetters.includes(response.first().content.toLowerCase())) {
									if (response.first().content.length === 1) {
										if (wordToGuessInArray.includes(response.first().content.toLowerCase())) {
											const embedtitlecorrect = message.language.get('COMMAND_HANGMAN_EMBEDTITLECORRECT', turn === 1 ? message.author.tag : member.tag, response.first().content.toLowerCase());
											firstEmbed.setTitle(embedtitlecorrect);

											for (let index2 = 0; index2 < wordToGuess.length; index2++) {
												if (wordToGuess[index2] === response.first().content.toLowerCase()) {
													newWordString[index2] = response.first().content.toLowerCase();
												}
											}
											const embeddescriptionwithtried = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTIONWITHTRIED', triedLetters.join(', '), `\`\`${newWordString.join(' ')}\`\``);
											firstEmbed.setDescription(embeddescriptionwithtried);

											hangmanEmbed.edit({
												embed: firstEmbed
											});
											
											turn = turn === 1 ? 2 : 1;

											if (!newWordString.includes('_') && turn === 1) {
												const mentiongamewon = message.language.get('COMMAND_HANGMAN_MENTIONGAMEWON', message.author, wordToGuess);
												return message.channel.send(mentiongamewon);
											} else if (!newWordString.includes('_') && turn === 2) {
												const mentiongamewon = message.language.get('COMMAND_HANGMAN_MENTIONGAMEWON', member, wordToGuess);
												return message.channel.send(mentiongamewon);
											}
										} else {
											if (!triedLetters.includes(response.first().content.toLowerCase())) {
												chances -= 1;
												triedLetters.push(response.first().content.toLowerCase());
											}

											let embedtitlewrong = message.language.get('COMMAND_HANGMAN_EMBEDTITLEWRONG', turn === 1 ? message.author.tag : member.tag, response.first().content.toLowerCase());

											const embeddescriptionwithtried = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTIONWITHTRIED', triedLetters.join(', '), `\`\`${newWordString.join(' ')}\`\``);
											embedtitlechances = message.language.get('COMMAND_HANGMAN_EMBEDTITLECHANCES', chances);
											if (chances > 0) {
												firstEmbed.setTitle(embedtitlewrong);
												firstEmbed.setFooter(embedtitlechances);
												firstEmbed.setDescription(embeddescriptionwithtried);
												firstEmbed.setImage(hangmanPictures[15 - chances]);

												turn = turn === 1 ? 2 : 1;

												hangmanEmbed.edit({
													embed: firstEmbed
												});
											} else {
												firstEmbed.setTitle(embedtitlewrong);
												firstEmbed.setFooter(embedtitlechances);
												firstEmbed.setDescription(embeddescriptionwithtried);
												firstEmbed.setImage(hangmanPictures[15 - chances]);

												if (turn === 1) {
													turn = 2;
												} else {
													turn = 1;
												}

												hangmanEmbed.edit({
													embed: firstEmbed
												});
												const mentionnowin = message.language.get('COMMAND_HANGMAN_MENTIONNOWIN', wordToGuess);
												return message.channel.send(mentionnowin);
											}
										}
									} else {
									/* eslint no-lonely-if: 0 */
										if (wordToGuess.length === response.first().content.length) {
											if (wordToGuess === response.first().content.toLowerCase()) {
												const embeddescriptionwithtried = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTIONWITHTRIED', triedLetters.join(', '), `\`\`${newWordString.join(' ')}\`\``);

												const embedtitlecorrect = message.language.get('COMMAND_HANGMAN_EMBEDTITLECORRECTWORD', turn === 1 ? message.author.tag : member.tag, response.first().content.toLowerCase());
												firstEmbed.setTitle(embedtitlecorrect);
												firstEmbed.setFooter(embedtitlechances);
												firstEmbed.setDescription(embeddescriptionwithtried);

												hangmanEmbed.edit({
													embed: firstEmbed
												});

												if (turn === 1) {
													turn = 2;
													const mentiongamewon = message.language.get('COMMAND_HANGMAN_MENTIONGAMEWON', message.author, response.first().content.toLowerCase());
													return message.channel.send(mentiongamewon);
												}
												turn = 1;
												const mentiongamewon = message.language.get('COMMAND_HANGMAN_MENTIONGAMEWON', member, response.first().content.toLowerCase());
												return message.channel.send(mentiongamewon);
											}

											chances -= 1;

											const embedtitlewrong = message.language.get('COMMAND_HANGMAN_EMBEDTITLEWRONGWORD', turn === 1 ? message.author.tag : member.tag, response.first().content.toLowerCase());
											firstEmbed.setTitle(embedtitlewrong);

											embedtitlechances = message.language.get('COMMAND_HANGMAN_EMBEDTITLECHANCES', chances)
											const embeddescriptionwithtried = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTIONWITHTRIED', triedLetters.join(', '), `\`\`${newWordString.join(' ')}\`\``);
											firstEmbed.setFooter(embedtitlechances);
											firstEmbed.setDescription(embeddescriptionwithtried);
											firstEmbed.setImage(hangmanPictures[15 - chances]);

											turn = turn === 1 ? 2 : 1;

											hangmanEmbed.edit({
												embed: firstEmbed
											});
										} else {
											const notwordcharacters = message.language.get('COMMAND_HANGMAN_NOTWORDCHARACTERS', wordToGuess.length);
											message.channel.send(notwordcharacters);
										}
									}
								} else {
									message.channel.send(message.language.get('COMMAND_HANGMAN_GUESSEDLETTERALREADY'));
								}
							} else {
								message.channel.send(message.language.get('COMMAND_HANGMAN_NOLETTER'));
							}
						} catch (error) {
							const noanswermention = message.language.get('COMMAND_HANGMAN_NOANSWERMENTION', turn === 1 ? message.author : member, turn === 1 ? member : message.author);
							return message.channel.send(noanswermention);
						}
					}
				} else if (r.emoji.name === '👎') {
					await questionMessage.delete();
					return message.reply(message.language.get('COMMAND_HANGMAN_DONTWANTTOPLAY'));
				}
			});
		} else {
			embedtitlechances = message.language.get('COMMAND_HANGMAN_EMBEDTITLECHANCES', chances)
			const embeddescription = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTION', `\`\`${newWordString.join(' ')}\`\``);
			const firstEmbed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle(message.language.get('COMMAND_HANGMAN_EMBEDTITLESTART'))
				.setFooter(embedtitlechances)
				.setImage(hangmanPictures[15 - chances])
				.setDescription(embeddescription);

			const hangmanEmbed = await message.channel.send({
				embed: firstEmbed
			});

			let msg;
			let response;

			for (let i = 0; i < 1000; i++) {
				try {
					if (msg) {
						await msg.delete();
						await response.first().delete();
					}
					msg = await message.reply(message.language.get('COMMAND_HANGMAN_LETTERORWORDMESSAGENOMENTION'));
					response = await message.channel.awaitMessages(msg2 => message.author.id === msg2.author.id, {
						max: 1,
						time: 180000,
						errors: ['time']
					});

					if (response.first().content.toLowerCase().match(/[a-z]/i)) {
						// eslint-disable-next-line no-negated-condition
						if (!triedLetters.includes(response.first().content.toLowerCase())) {
							if (response.first().content.length === 1) {
								if (wordToGuessInArray.includes(response.first().content.toLowerCase())) {
									const embedtitlecorrectnomention = message.language.get('COMMAND_HANGMAN_EMBEDTITLECORRECTNOMENTION', response.first().content.toLowerCase());
									firstEmbed.setTitle(embedtitlecorrectnomention);

									for (let index2 = 0; index2 < wordToGuess.length; index2++) {
										if (wordToGuess[index2] === response.first().content.toLowerCase()) {
											newWordString[index2] = response.first().content.toLowerCase();
										}
									}
									const embeddescriptionwithtried = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTIONWITHTRIED', triedLetters.join(', '), `\`\`${newWordString.join(' ')}\`\``);
									firstEmbed.setDescription(embeddescriptionwithtried);

									hangmanEmbed.edit({
										embed: firstEmbed
									});

									const gamewon = message.language.get('COMMAND_HANGMAN_GAMEWON', wordToGuess);
									if (!newWordString.includes('_')) return message.reply(gamewon);
								} else {
									if (!triedLetters.includes(response.first().content.toLowerCase())) {
										chances -= 1;
										triedLetters.push(response.first().content.toLowerCase());
									}

									const embeddescriptionwithtried = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTIONWITHTRIED', triedLetters.join(', '), `\`\`${newWordString.join(' ')}\`\``);
									const embedtitlewrongnomention = message.language.get('COMMAND_HANGMAN_EMBEDTITLEWRONGNOMENTION', response.first().content.toLowerCase());
									embedtitlechances = message.language.get('COMMAND_HANGMAN_EMBEDTITLECHANCES', chances);
									if (chances > 0) {
										firstEmbed.setTitle(embedtitlewrongnomention);
										firstEmbed.setFooter(embedtitlechances);
										firstEmbed.setDescription(embeddescriptionwithtried);
										firstEmbed.setImage(hangmanPictures[15 - chances]);

										hangmanEmbed.edit({
											embed: firstEmbed
										});
									} else {
										firstEmbed.setTitle(embedtitlewrongnomention);
										firstEmbed.setFooter(embedtitlechances);
										firstEmbed.setDescription(embeddescriptionwithtried);
										firstEmbed.setImage(hangmanPictures[15 - chances]);

										hangmanEmbed.edit({
											embed: firstEmbed
										});
										const gamelost = message.language.get('COMMAND_HANGMAN_GAMELOST', wordToGuess);
										return message.reply(gamelost);
									}
								}
							} else {
							/* eslint no-lonely-if: 0 */
								if (wordToGuess.length === response.first().content.length) {
									const embeddescriptionwithtried = message.language.get('COMMAND_HANGMAN_EMBEDDESCRIPTIONWITHTRIED', triedLetters.join(', '), `\`\`${newWordString.join(' ')}\`\``);
									const embedtitlecorrectnomention = message.language.get('COMMAND_HANGMAN_EMBEDTITLECORRECTNOMENTIONWORD', response.first().content.toLowerCase());
									embedtitlechances = message.language.get('COMMAND_HANGMAN_EMBEDTITLECHANCES', chances);
									if (wordToGuess === response.first().content.toLowerCase()) {
										firstEmbed.setTitle(embedtitlecorrectnomention);
										firstEmbed.setFooter(embedtitlechances);
										firstEmbed.setDescription(embeddescriptionwithtried);

										hangmanEmbed.edit({
											embed: firstEmbed
										});
										const gamewon = message.language.get('COMMAND_HANGMAN_GAMEWON', wordToGuess);
										return message.reply(gamewon);
									}

									chances -= 1;
									embedtitlechances = message.language.get('COMMAND_HANGMAN_EMBEDTITLECHANCES', chances);
									const embedtitlewrongnomentionword = message.language.get('COMMAND_HANGMAN_EMBEDTITLEWRONGNOMENTIONWORD', response.first().content.toLowerCase());
									firstEmbed.setTitle(embedtitlewrongnomentionword);
									firstEmbed.setFooter(embedtitlechances);
									firstEmbed.setDescription(embeddescriptionwithtried);
									firstEmbed.setImage(hangmanPictures[15 - chances]);

									hangmanEmbed.edit({
										embed: firstEmbed
									});
								} else {
									const notwordcharacters = message.language.get('COMMAND_HANGMAN_NOTWORDCHARACTERS', wordToGuess.length);
									message.reply(notwordcharacters);
								}
							}
						} else {
							message.channel.send(message.language.get('COMMAND_HANGMAN_GUESSEDLETTERALREADY'));
						}
					} else {
						message.reply(message.language.get('COMMAND_HANGMAN_NOLETTER'));
					}
				} catch (error) {
					const noanswer = message.language.get('COMMAND_HANGMAN_NOANSWER', wordToGuess);
					return message.channel.send(noanswer);
				}
			}
		}
	}
};