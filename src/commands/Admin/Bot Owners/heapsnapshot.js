// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
const { Command } = require('klasa');
const { join } = require('path');
const writeSnapshot = require('util').promisify(require('heapdump').writeSnapshot);

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			hidden: true,
			description: language => language.get('COMMAND_HEAPSNAPSHOT_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_HEAPSNAPSHOT_EXTENDEDHELP')
		});
	}

	async run(message) {
		await message.sendLocale('COMMAND_HEAPSNAPSHOT_CAPTURING');

		// Capture the snapshot (this freezes the entire VM)
		const path = join(process.cwd(), `${Date.now()}.heapsnapshot`);
		await writeSnapshot(path);

		return message.sendLocale('COMMAND_HEAPSNAPSHOT_CAPTURED_DONE', path);
	}

};