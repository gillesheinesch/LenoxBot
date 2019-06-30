const { Message } = require('discord.js');
const { Extendable } = require('klasa');

module.exports = class extends Extendable {
	constructor(...args) {
		super(...args, { appliesTo: [Message] });
	}

	/**
	 * Register's this message as a Command Message
	 * @since 0.5.0
	 * @param {Object} commandInfo The info about the command and prefix used
	 * @property {Command} command The command run
	 * @property {RegExp} prefix The prefix used
	 * @property {number} prefixLength The length of the prefix used
	 * @returns {this}
	 * @private
	 */
	_registerCommand({ command, prefix, prefixLength }) {
		this.command = command;
		this.prefix = prefix;
		this.prefixLength = prefixLength;
		this.prompter = this.command.usage.createPrompt(this, {
			quotedStringSupport: this.command.quotedStringSupport,
			time: this.command.promptTime,
			limit: this.command.promptLimit
		});
		this.client.emit('commandRun', this, this.command, this.args);
		return this;
	}

	/**
	 * Awaits a response from the author.
	 * @param {string} text The text to prompt the author
	 * @param {number} [time=30000] The time to wait before giving up
	 * @returns {KlasaMessage}
	 */
	async prompt(text, time = 30000) {
		const message = await this.channel.send(text);
		const responses = await this.channel.awaitMessages(msg => msg.author === this.author, { time, max: 1 });
		message.delete();
		if (responses.size === 0) throw this.language.get('MESSAGE_PROMPT_TIMEOUT');
		return responses.first();
	}
};
