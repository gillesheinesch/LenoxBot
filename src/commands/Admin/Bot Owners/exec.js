const { Command } = require('klasa');
const { exec } = require('child_process');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['execute'],
			description: language => language.get('COMMAND_EXEC_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_EXEC_EXTENDEDHELP'),
			guarded: true,
			permissionLevel: 10,
			usage: '<expression:str>',
			hidden: true
		});
	}

	async run(msg, [input]) {
		const parsed = this.client.utils.parseArgs([input], ['r', 'd', 's', 'f', 'w', 'fn:', 'l:']);
		if (parsed.length < 1) {
			throw 'You must provide a command to run!';
		}

		if (msg.flags.del || msg.flags.delete) {
			msg.delete();
		}

		const ps = exec(parsed.leftover.join(' '), { timeout: 'timeout' in msg.flags ? Number(msg.flags.timeout) : 60000 });
		if (!ps) {
			throw 'Failed to start process!';
		}

		if (msg.flags.silent) {
			return;
		}

		const opts = {
			delay: 10,
			cutOn: '\n'
		};

		if (!msg.flags.raw) {
			opts.prefix = `\`\`\`${(msg.flags.lang || msg.flags.language) || 'prolog'}\n`;
			opts.suffix = '\n```';
		}

		if (msg.flags.file) {
			let output = '';

			ps.stdout.on('data', data => output += data.toString());
			await new Promise(resolve => {
				ps.once('exit', async () => {
					if (!output) {
						return resolve();
					}

					try {
						await msg.send({
							files: [
								{
									attachment: output.replace(/^file:\/\//, ''),
									name: (msg.flags.fn || msg.flags.filename)
								}
							]
						});
					} catch (err) {
						msg.error('Invalid URL/path!');
					}

					resolve();
				});
			});
		} else if (msg.flags.wait) {
			let output = '';
			const handler = data => output += data.toString();

			[ps.stdout, ps.stderr].forEach(stream => stream.on('data', handler));

			await new Promise(resolve => {
				ps.once('exit', async () => {
					if (!output) {
						return resolve();
					}

					await this.client.utils.sendLarge(msg, `${this.clean(output)}`, `**\`OUTPUT\`**`, opts);

					resolve();
				});
			});
		} else {
			ps.stdout.on('data', data => this.client.utils.sendLarge(msg, `${this.clean(data)}`, `**\`OUTPUT\`**`, opts));
			ps.stderr.on('data', data => this.client.utils.sendLarge(msg, `${this.clean(data)}`, `**\`ERROR\`**`, opts));

			await new Promise(resolve => ps.once('exit', resolve));
		}
	}

	clean(data) {
		return `${data}`
			.replace(/`/g, '\u200b$&')
			.replace(/\[[0-9]*m/g, '');
	}
};
