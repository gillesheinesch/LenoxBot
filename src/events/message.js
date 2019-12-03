// Packages
const { Language: { t }, Context } = require('../');

// Exports
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        // *========================== [DEFINE] ==========================* \\

        // !-- Fixes for guild only --! \\
        const prefix = '?'; //testing
        const language = "en-US"; //testing

        // !-- Chat Arguments & Command --! \\
        const args = message.content.split(/\s+/g);
        const cmd = args.shift().slice(prefix.length);
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

        // *========================== [STUFFS] ==========================* \\

        // !-- Ignores Bot's & Ignores messages without prefix --! \\
        if (message.author.bot || !message.content.startsWith(prefix)) return;

        // !-- Command Context --! \\
        const context = new Context({
            client: this.client,
            message: message,
            command: command,
            language: language,
            prefix: prefix,
            t: t
        });

        // !-- Block Commands --! \\

        // will

        // !-- Run's Commands --! \\
        
        this.client.runCommand(context, args, command);
    }
};