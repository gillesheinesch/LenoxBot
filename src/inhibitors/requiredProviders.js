// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {
	async run(message, command) {
		if (!command.requiredProviders || !command.requiredProviders.length) return false;
		const providers = command.requiredProviders.filter(provider => !this.client.providers.has(provider));
		if (!providers.length) throw `The client is missing the **${providers.join(', ')}** provider${providers.length > 1 ? 's' : ''} and cannot run.`;
		return false;
	}
};
