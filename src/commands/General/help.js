const { RichDisplay, util: { isFunction }, ReactionHandler } = require('klasa');
const { MessageEmbed, Permissions } = require('discord.js');
const Command = require('../../lib/LenoxCommand');

const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADD_REACTIONS]);
const time = 1000 * 60 * 3;

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['commands', 'cmds'],
			guarded: true,
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(command:command)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, message);
		});

		// Cache the handlers
		this.handlers = new Map();
	}

	async run(message, [command]) {
		if (command) {
			if (message.author !== this.client.owner && command.hidden) return;
			let prefix = message.prefixLength ? message.content.slice(0, message.prefixLength) : message.guildSettings.get('prefix');
			if (message.prefix === this.client.monitors.get('commandHandler').prefixMention) prefix = `@${this.client.user.tag}`;
			else if (Array.isArray(prefix)) [prefix] = prefix;
			const command_information = [
				`${message.language.get('COMMAND_HELP_DESCRIPTION_DESC')} ${isFunction(command.description) ? command.description(message.language) : command.description}`,
				`${message.language.get('COMMAND_HELP_USAGE_DESC')} \`${prefix}${command.name} ${command.usage.usageString}\``,
				`${message.language.get('COMMAND_HELP_ALIASES_DESC')} \`${command.usage.names.removeValue(command.name).length > 0 ? command.usage.names.removeValue(command.name).join('` `') : `<${message.language.get('COMMAND_HELP_NO_ALIASES_DESC')}>`}\``
			];
			if (command.extendedHelp) command_information.push(message.language.get('COMMAND_HELP_EXTENDED_DESC'), isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp);
			const embed = new MessageEmbed()
				.setColor(0x8AB4F5)
				.setTitle(`= ${command.name} =`)
				.addField('​', command_information.join('\n'));
			return message.send(embed);
		}

		if (!message.flags.all && message.guild && message.channel.permissionsFor(this.client.user).has(PERMISSIONS_RICHDISPLAY)) {
			// Finish the previous handler
			const previousHandler = this.handlers.get(message.author.id);
			if (previousHandler) previousHandler.stop();

			const handler = await this.redirectDisplay(message, await this.buildDisplay(message), time);
			if (handler instanceof ReactionHandler) {
				handler.on('end', () => this.handlers.delete(message.author.id));
				this.handlers.set(message.author.id, handler);
			}
			return handler;
		}

		const method = this.client.user.bot ? 'author' : 'channel';
		return message[method].send(await this.buildHelp(message), { split: { 'char': '\n' } })
			.then(() => { if (message.channel.type !== 'dm' && this.client.user.bot) message.sendLocale('COMMAND_HELP_DM'); })
			.catch(() => { if (message.channel.type !== 'dm' && this.client.user.bot) message.sendLocale('COMMAND_HELP_NODM'); });
	}

	async buildHelp(message) {
		const commands = await this._fetchCommands(message);
		const prefix = message.guildSettings.get('prefix');

		const helpMessage = [];
		for (const [category, list] of commands) {
			helpMessage.push(message.language.get('COMMAND_HELP_CATEGORIES', category), list.map(this.formatCommand.bind(this, message, prefix, false)).join('\n'), '');
		}

		return helpMessage.join('\n');
	}

	async buildDisplay(message) {
		const commands = await this._fetchCommands(message);
		const prefix = message.guildSettings.get('prefix');
		const display = new RichDisplay();
		for (const [category, list] of commands) {
			display.addPage(new MessageEmbed()
				.setTitle(message.language.get('COMMAND_HELP_CATEGORIES_TITLE', category))
				.setColor(0x8AB4F5)
				.setDescription(list.map(this.formatCommand.bind(this, message, prefix, true)).join('\n')));
		}

		return display;
	}

	formatCommand(message, prefix, richDisplay, command) {
		const description = isFunction(command.description) ? command.description(message.language) : command.description;
		return richDisplay ? `• ${prefix}${command.name} → ${description}` : `• **${prefix}${command.name}** → ${description}`;
	}

	async _fetchCommands(message) {
		const run = this.client.inhibitors.run.bind(this.client.inhibitors, message);
		const commands = new Map();
		await Promise.all(this.client.commands.map(command => !command.hidden && run(command, true)
			.then(() => {
				const category = commands.get(command.category);
				if (category) category.push(command);
				else commands.set(command.category, [command]);
			}).catch(() => {
				// Noop
			})));

		return commands;
	}
};
