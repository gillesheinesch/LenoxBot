const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'botowner', 'moderation', 'trello', 'staff', 'application'];
	const margs = msg.content.split(" ");
	const commandNames = Array.from(client.commands.keys());
	const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
	const embed = new Discord.RichEmbed()
	.setColor('#0066CC')
	.setDescription(`For more information about a command, type in ${tableload.prefix}help {commandname}`);
	for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "administration") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "administration").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });

				await message.react('◀');
				await message.react('▶');

				var first = 0;
				var second = 20;

				var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
				collector.on('collect', r => {
					var reactionadd = client.commands.filter(c => c.help.category === "administration").array().slice(first + 20, second + 20).length;
					var reactionremove = client.commands.filter(c => c.help.category === "administration").array().slice(first - 20, second - 20).length;

					if (r.emoji.name === '▶' && reactionadd !== 0) {
						r.remove(msg.author.id);
						const array = client.commands.filter(c => c.help.category === "administration").array();
						
						var slicedmsg = array.slice(first + 20, second + 20);

						first = first + 20;
						second = second + 20;

						const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);

						message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
					} else if (r.emoji.name === '◀' && reactionremove !== 0) {
						r.remove(msg.author.id);
						const xxx = client.commands.filter(c => c.help.category === "administration").array();
						
						var xx = xxx.slice(first - 20, second - 20);
						first = first - 20;
						second = second - 20;


						const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
						message.edit(x.join("\n"), { code: 'asciidoc' });
					}
				});
				collector.on('end',(collected, reason) => {
					message.react('❌');
				});
				return undefined;
			} else if (margs[1].toLowerCase() == "utility") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "utility").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "utility").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "utility").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "utility").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "utility").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "music") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "music").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "music").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "music").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "music").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "music").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "fun") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "fun").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "fun").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "fun").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "fun").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "fun").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "help") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "help").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "help").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "help").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "help").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "help").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "searches") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "searches").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "searches").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "searches").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "searches").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "searches").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "botowner") {
				if (msg.author.id !== '238590234135101440') return msg.channel.send('You dont have permissions to execute this command!');
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "botowner").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "botowner").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "botowner").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "botowner").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "botowner").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "staff") {
				if (!msg.member.roles.get('386627285119402006')) return msg.channel.send('You dont have permissions to execute this command!');
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "staff").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "staff").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "staff").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "staff").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "staff").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "nsfw") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "nsfw").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									r.remove(msg.author.id);
									var reactionadd = client.commands.filter(c => c.help.category === "nsfw").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "nsfw").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										const array = client.commands.filter(c => c.help.category === "nsfw").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "nsfw").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "moderation") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "moderation").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "moderation").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "moderation").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "moderation").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "moderation").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "trello") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "trello").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "trello").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "trello").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "trello").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "trello").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			} else if (margs[1].toLowerCase() == "application") {
				const message = await msg.channel.send(`${client.commands.filter(c => c.help.category === "application").array().slice(0, 20).map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`).join("\n")}`, { code:'asciidoc' });
				
								await message.react('◀');
								await message.react('▶');
				
								var first = 0;
								var second = 20;
				
								var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, { time: 30000 });
								collector.on('collect', r => {
									var reactionadd = client.commands.filter(c => c.help.category === "application").array().slice(first + 20, second + 20).length;
									var reactionremove = client.commands.filter(c => c.help.category === "application").array().slice(first - 20, second - 20).length;
				
									if (r.emoji.name === '▶' && reactionadd !== 0) {
										r.remove(msg.author.id);
										const array = client.commands.filter(c => c.help.category === "application").array();
										
										var slicedmsg = array.slice(first + 20, second + 20);
				
										first = first + 20;
										second = second + 20;
				
										const finishedmsg = slicedmsg.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
				
										message.edit(finishedmsg.join("\n"), { code: 'asciidoc' });
									} else if (r.emoji.name === '◀' && reactionremove !== 0) {
										r.remove(msg.author.id);
										const xxx = client.commands.filter(c => c.help.category === "trello").array();
										
										var xx = xxx.slice(first - 20, second - 20);
										first = first - 20;
										second = second - 20;
				
				
										const x = xx.map(cmd => `${tableload.prefix}${cmd.help.name}${' '.repeat(longest - cmd.help.name.length)} :: ${cmd.help.description}`);
										message.edit(x.join("\n"), { code: 'asciidoc' });
									}
								});
								collector.on('end',(collected, reason) => {
									message.react('❌');
								});
								return undefined;
			}
		}
	}
	msg.channel.send(`There was an error. See ${tableload.prefix}modules to get a list of all available modules that you can use!`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['cmds'],
    userpermissions: []
};
exports.help = {
	name: 'commands',
	description: 'All commands of a module',
	usage: 'commands {Modulename}',
	example: ['commands Help'],
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};

