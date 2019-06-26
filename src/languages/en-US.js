const { Language, util } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			MESSAGE_PROMPT_CANCELED: "Canceled command.",
			MULTIPLE_ITEMS_FOUND_PROMPT: (results) => `Multiple items found. Please choose one of the following, or type cancel.${results}`,
			// Prompt Actions
			ANSWER_CANCEL_PROMPT: "cancel"
		};
	}

	async init() {
		await super.init();
	}

};