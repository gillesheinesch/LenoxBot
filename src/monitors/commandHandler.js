const { MessageEmbed } = require('discord.js');
const { Monitor, Stopwatch, util: { regExpEsc } } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, { ignoreOthers: false });
		this.ignoreEdits = !this.client.options.commandEditing;
		this.prefixes = new Map();
		this.prefixMention = null;
		this.mentionOnly = null;
		this.prefixFlags = this.client.options.prefixCaseInsensitive ? 'i' : '';
	}

	async run(message) {
		if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
		if (!message.channel.postable) return undefined;
		/*if (!message.commandText && message.prefix === this.client.mentionPrefix) {
			const prefix = message.guildSettings.get('prefix');
			return message.sendLocale('PREFIX_REMINDER', [prefix.length ? prefix : undefined]);
		}*/
		if (this.mentionOnly.test(message.content)) return message.send(null, {
			embed: {
				color: 0x3669FA,
				title: `Hi!`,
				description: `I'm **${this.client.user.tag}**!\n\nRun **${message.guild ? message.guildSettings.get('prefix') : '@' + this.client.user.tag + ' '}help** to see what commands I have!`,
				thumbnail: {
					url: this.client.user.displayAvatarURL()
				}
			}
		});

		const { commandText, prefix, prefixLength } = this.parseCommand(message);
		if (!commandText) return undefined;

		const command = this.client.commands.get(commandText);
		if (!command) return this.client.emit('commandUnknown', message, commandText, prefix, prefixLength);
		if (command.needsMember) {
			if (message.guild) await message.guild.members.fetch(message.author, true);
			try {
				await message.member.settings.sync(true);
			} catch (e) {
				if (message.channel.type === 'dm') throw new MessageEmbed()
					.setColor(15684432)
					.setDescription('This command can only be used in a server.')
					.setTimestamp(new Date())
			}
		}
		return this.runCommand(message._registerCommand({ command, prefix, prefixLength }));
	}

	parseCommand(message) {
		const result = this.customPrefix(message) || this.mentionPrefix(message) || this.naturalPrefix(message) || this.prefixLess(message);
		return result ? {
			commandText: message.content.slice(result.length).trim().split(' ')[0].toLowerCase(),
			prefix: result.regex,
			prefixLength: result.length
		} : { commandText: false };
	}

	customPrefix({ content, guildSettings }) {
		const prefix = guildSettings.get('prefix')
		if (!prefix) return null;
		for (const preflx of Array.isArray(prefix) ? prefix : [prefix]) {
			const testingPrefix = this.prefixes.get(preflx) || this.generateNewPrefix(preflx);
			if (testingPrefix.regex.test(content)) return testingPrefix;
		}
		return null;
	}

	mentionPrefix({ content }) {
		const prefixMention = this.prefixMention.exec(content);
		return prefixMention ? { length: prefixMention[0].length, regex: this.prefixMention } : null;
	}

	naturalPrefix({ content, guildSettings }) {
		const disableNaturalPrefix = guildSettings.get('disableNaturalPrefix');
		if (disableNaturalPrefix || !this.client.options.regexPrefix) return null;
		const results = this.client.options.regexPrefix.exec(content);
		return results ? { length: results[0].length, regex: this.client.options.regexPrefix } : null;
	}

	prefixLess({ channel: { type } }) {
		return this.client.options.noPrefixDM && type === 'dm' ? { length: 0, regex: null } : null;
	}

	generateNewPrefix(prefix) {
		const prefixObject = { length: prefix.length, regex: new RegExp(`^${regExpEsc(prefix)}`, this.prefixFlags) };
		this.prefixes.set(prefix, prefixObject);
		return prefixObject;
	}

	async runCommand(message) {
		const timer = new Stopwatch();
		if (this.client.options.typing) message.channel.startTyping();
		try {
			await this.client.inhibitors.run(message, message.command);
			try {
				await message.prompter.run();
				try {
					const subcommand = message.command.subcommands ? message.params.shift() : undefined;
					const commandRun = subcommand ? message.command[subcommand](message, message.params) : message.command.run(message, message.params);
					timer.stop();
					const response = await commandRun;
					this.client.finalizers.run(message, message.command, response, timer);
					if ((message.channel.type === 'dm' && message.author.id !== process.env.BOT_OWNER_ID) || (message.channel.type !== 'dm' && message.channel.id !== '345551930459684866')) {
						if (this.client.channels.has(process.env.BOT_DEBUG_MESSAGES)) this.client.channels.get(process.env.BOT_DEBUG_MESSAGES).send(null, {
							embed: {
								color: 15684432,
								timestamp: new Date(),
								description: `\`\`\`\n${message.content}\n\`\`\``,
								author: {
									name: `${message.author.tag} - ${message.author.id}`,
									icon_url: message.author.displayAvatarURL()
								},
								fields: [
									{
										name: 'Guild',
										value: `${message.guild ? message.guild.name || message.channel.type : message.channel.type} \`${message.guild ? message.guild.id || message.channel.type : message.channel.type}\``
									}, {
										name: 'Channel',
										value: `${message.channel.type !== 'dm' ? `${message.channel} \`${message.channel.id}\` [<:jumpbutton:488127322134806528>](${message.url} "Jump to Message")` : `\`${message.channel.type}\``}`
									}, {
										name: 'Jump',
										value: message.channel.type !== 'dm' ? message.url : '`N/A`'
									}
								]
							}
						}).catch(console.error);
					}
					this.client.emit('commandSuccess', message, message.command, message.params, response);
				} catch (error) {
					if (error.toString() === '[object Object]') return;
					if (this.client.channels.has(process.env.BOT_CONSOLE_LOG)) this.client.channels.get(process.env.BOT_CONSOLE_LOG).send(null, {
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: error.name ? error.name : 'Unknown Error',
							author: {
								name: message.author.tag,
								icon_url: message.author.displayAvatarURL()
							},
							footer: {
								text: error ? error.toString() : 'N/A'
							},
							description: `${error.stack ? `\`\`\`x86asm\n${error.stack}\n\`\`\`` : '`N/A`'}`,
							fields: [
								{
									name: 'Extra Information:',
									value: '​'
								}, {
									name: 'Error:',
									value: `\`${error ? error.toString() : 'N/A'}\``
								}, {
									name: 'Error Name:',
									value: `\`${error.name ? error.name : 'N/A'}\``
								}, {
									name: 'Error Message:',
									value: `\`${error.message ? error.message : 'N/A'}\``
								}, {
									name: 'Command:',
									value: `\`${(message.command ? (message.command.name ? message.command : 'Unknown Command') : 'Unknown Command')}\``
								}, {
									name: 'Message Content:',
									value: message.content ? `\`\`\`\n${message.content}\n\`\`\`` : '`N/A`'
								}
							]
						}
					}).catch(console.error);
					this.client.emit('commandError', message, message.command, message.params, error);
				}
			} catch (argumentError) {
				this.client.emit('argumentError', message, message.command, message.params, argumentError);
			}
		} catch (response) {
			this.client.emit('commandInhibited', message, message.command, response);
		}
		if (this.client.options.typing) message.channel.stopTyping();
	}

	init() {
		this.prefixMention = new RegExp(`^<@!?${this.client.user.id}>`);
		this.mentionOnly = new RegExp(`^<@!?${this.client.user.id}>$`);
	}

};