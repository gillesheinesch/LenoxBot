const { Language, util } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			// Prompts
			MESSAGE_PROMPT_CANCELED: "Canceled command.",
			MULTIPLE_ITEMS_FOUND_PROMPT: (results) => `Multiple items found. Please choose one of the following, or type cancel.${results}`,
			ANSWER_CANCEL_PROMPT: "cancel",

			// Commands
			COMMAND_PING_DESCRIPTION: "Runs a connection test to Discord.",
			COMMAND_PING: "Ping?",
			COMMAND_PINGPONG: (latencyms, latencyapims) => `Latency: ${latencyms} \nAPI Latency: ${latencyapims}`,
			COMMAND_HELP_DESCRIPTION: "Display help for a command.",
			COMMAND_HELP_DM: "📥 | The list of commands you have access to has been sent to your DMs.",
			COMMAND_HELP_NODM: "❌ | You have DMs disabled, I couldn't send you the commands in DMs.",
			COMMAND_HELP_USAGE: (usage) => `Usage :: ${usage}`,
			COMMAND_HELP_EXTENDED_DESC: "**Extended Help:**",
			COMMAND_HELP_EXTENDED: "Extended Help ::",
			COMMAND_HELP_DESCRIPTION_DESC: "**Description:**",
			COMMAND_HELP_USAGE_DESC: "**Usage:**",
			COMMAND_HELP_ALIASES_DESC: "**Aliases:**",
			COMMAND_HELP_NO_ALIASES_DESC: "no aliases",
			COMMAND_HELP_CATEGORIES: (category) => `**${category} Commands**:\n`,
			COMMAND_HELP_CATEGORIES_TITLE: (category) => `${category} Commands`
		};
	}

	async init() {
		await super.init();
	}

};