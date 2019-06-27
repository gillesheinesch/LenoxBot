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
}