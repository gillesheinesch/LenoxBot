const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');

const { readdir } = require('fs');
const { scan, ensureDir } = require('fs-nextra');
const { extname, resolve } = require('path');

module.exports = class LenoxBot extends Client {
    constructor (options = {}) {
        super(options);

        this.commands = new Collection();
        this.aliases = new Collection();

        this.setMaxListeners(500);

        this.on('warn', console.warn);
        this.on('error', console.error);

        this.on('disconnect', e => {
            if (e.code === 1000) return console.log('Disconnected from Discord!');
            else if (e.code === 4004) return console.error('Failed to authenticate with Discord!').then(() => { process.exit() });
            else { console.log(`Disconnected from Discord (${e.code})`); }

            process.exit().then(() => this.login());
        });

        // No more crashing :)))) So that's the code needed to run the bot 24/7? And if it crashes it starts again?
        process.on('exit', () => process.exit().then(() => this.login()));
        process.on('unhandledRejection', err => { console.error(err) });
    }

    async login (token) {
        config();

        token = token || process.env.TOKEN;
    
        this.setup() && super.login(token);

        console.log('Succesfully deployed!');
    }

    async setup() {
        return this.loadCommands() && this.loadEvents();
    }

    async loadCommands (dir = './commands/') {
        const files = await scan(resolve(dir), { filter: (stats, path) => stats.isFile() && extname(path) === '.js' }).catch(() => ensureDir(dir).catch(err => console.error(err.stack)));
        
        return Promise.all([...files.keys()].map(path => { 
            delete require.cache[path];

            const command = new (require(path))(this);

            this.commands.set(command.name, command);

            command.aliases.forEach(alias => {
                this.aliases.set(alias, command.name);
            });
        }));
    }

    loadEvents (dir = './events') {
        readdir(dir, (err, files) => {
            if (err) return console.error(err);

            files.forEach(e => {
                const event = new (require(`../events/${e}`))(this);

                super.on(e.split('.')[0], (...args) => event.run(...args));
            });
        });
    }

    runCommand(context, args, command) {
        command._run(context, args).catch(err => console.error(err));
    }
}