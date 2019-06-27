const { Message } = require('discord.js');
const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: [Message] });
	}

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