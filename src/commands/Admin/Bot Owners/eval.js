/*
MIT License

Copyright (c) 2017-2018 dirigeants

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
const { Command, Stopwatch, Type, util } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['ev', 'javascript', 'js'],
			description: language => language.get('COMMAND_EVAL_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_EVAL_EXTENDED'),
			guarded: true,
			permissionLevel: 10,
			usage: '<expression:str>',
			hidden: true
		});
		this.timeout = 30000;
	}

	async run(message, [code]) {
		const flagTime = 'no-timeout' in message.flags ? 'wait' in message.flags ? Number(message.flags.wait) : this.timeout : Infinity;
		const language = message.flags.lang || message.flags.language || (message.flags.json ? 'json' : 'js');
		const { success, result, time, type } = await this.timedEval(message, code, flagTime);

		if (message.flags.silent) {
			if (!success && result && result.stack) this.client.emit('error', result.stack);
			return null;
		}

		const footer = util.codeBlock('ts', type);
		const sendAs = message.flags.output || message.flags['output-to'] || (message.flags.log ? 'log' : null);
		return this.handleMessage(message, { sendAs, hastebinUnavailable: false, mystbinUnavailable: false, url: null }, { success, result, time, footer, language });
	}

	async handleMessage(message, options, { success, result, time, footer, language }) {
		switch (options.sendAs) {
			case 'file': {
				if (message.channel.attachable) return message.channel.sendFile(Buffer.from(result), 'output.txt', message.language.get('COMMAND_EVAL_OUTPUT_FILE', time, footer));
				await this.getTypeOutput(message, options);
				return this.handleMessage(message, options, { success, result, time, footer, language });
			}
			case 'haste':
			case 'hastebin': {
				if (!options.url) options.url = await this.client.utils.hastebinUpload(result, language).catch(() => null);
				if (options.url) return message.send(message.language.get('COMMAND_EVAL_OUTPUT_HASTEBIN', time, options.url, footer));
				options.hastebinUnavailable = true;
				await this.getTypeOutput(message, options);
				return this.handleMessage(message, options, { success, result, time, footer, language });
			}
			case 'mystbin': {
				if (!options.url) options.url = await this.client.utils.mystbinUpload(result, language).catch(() => null);
				if (options.url) return message.send(message.language.get('COMMAND_EVAL_OUTPUT_MYSTBIN', time, options.url, footer));
				options.mystbinUnavailable = true;
				await this.getTypeOutput(message, output);
				return this.handleMessage(message, options, { success, result, time, footer, language });
			}
			case 'console':
			case 'log': {
				this.client.emit('log', result);
				return message.send(message.language.get('COMMAND_EVAL_OUTPUT_CONSOLE', time, footer));
			}
			case 'none':
				return null;
			default: {
				if (result.length > 2000) {
					await this.getTypeOutput(message, options);
					return this.handleMessage(message, options, { success, result, time, footer, language });
				}
				return message.send(message.language.get(success ? 'COMMAND_EVAL_OUTPUT' : 'COMMAND_EVAL_ERROR',
					time, util.codeBlock(language, result), footer));
			}
		}
	}

	async getTypeOutput(message, options) {
		const _options = ['log'];
		if (message.channel.attachable) _options.push('file');
		if (!options.hastebinUnavailable) _options.push('hastebin');
		if (!options.mystbinUnavailable) _options.push('mystbin');
		let _choice;
		do {
			_choice = await message.prompt(message.language.get('COMMAND_EVAL_CHOOSE_ONE_OF_THE_OPTIONS_PROMPT', _options)).catch(() => ({ content: 'none' }));
		} while (![...message.language.get('ANSWER_EVAL_UPLOAD_TO_SERVICE_PROMPT'), null].includes(_choice.content));
		options.sendAs = _choice.content;
	}

	timedEval(message, code, flagTime) {
		if (flagTime === Infinity || flagTime === 0) return this.eval(message, code);
		return Promise.race([
			util.sleep(flagTime).then(() => ({
				success: false,
				result: message.language.get('COMMAND_EVAL_TIMEOUT', flagTime / 1000),
				time: '⏱ ...',
				type: 'EvalTimeoutError'
			})),
			this.eval(message, code)
		]);
	}

	// Eval the input
	async eval(msg, code) {
		const stopwatch = new Stopwatch();
		let success; let syncTime; let asyncTime; let result;
		let thenable = false;
		let type;
		try {
			if (msg.flags.async) code = `(async () => {\n${code}\n})();`;
			result = eval(code);
			syncTime = stopwatch.toString();
			type = new Type(result);
			if (util.isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (thenable && !asyncTime) asyncTime = stopwatch.toString();
			if (!type) type = new Type(error);
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (typeof result !== 'string') {
			result = result instanceof Error ? result.stack : msg.flags.json ? JSON.stringify(result, null, 4) : inspect(result, {
				depth: msg.flags.depth ? parseInt(msg.flags.depth) || 0 : 0,
				showHidden: Boolean(msg.flags.showHidden)
			});
		}
		return { success, type, time: this.formatTime(syncTime, asyncTime), result: util.clean(typeof (result) === 'string' ? result : JSON.stringify(result)) };
	}

	formatTime(syncTime, asyncTime) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}
};


/**
	The eval command evaluates code as-in, any error thrown from it will be handled.
	It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.
	The --wait flag changes the time the eval will run. Defaults to 10 seconds. Accepts time in milliseconds.
	The --output and --output-to flag accept either 'file', 'log', 'haste' or 'hastebin'.
	The --delete flag makes the command delete the message that executed the message after evaluation.
	The --silent flag will make it output nothing.
	The --depth flag accepts a number, for example, --depth=2, to customize util.inspect's depth.
	The --async flag will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword
	The --showHidden flag will enable the showHidden option in util.inspect.
	The --lang and --language flags allow different syntax highlight for the output.
	The --json flag converts the output to json
	The --no-timeout flag disables the timeout
	If the output is too large, it'll send the output as a file, or in the console if the bot does not have the ATTACH_FILES permission.
 */
