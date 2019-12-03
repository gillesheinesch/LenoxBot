const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');

const { readdir } = require('fs');
const { scan, ensureDir } = require('fs-nextra');
const { resolve, extname } = require('path');

module.exports = class Lenox extends Client {
    constructor(options = {}) {
        super(options);

        this.commands = new Collection();
        this.aliases = new Collection();

        this.log = require('../utils/Console');
        this.constants = require('../utils/Constants');

        this.setMaxListeners(500);

        this.on('error', console.error);
        this.on('warn', console.warn);

        this.on('disconnect', e => {
            if (e.code === 1000) return this.log.error('Disconnected from Discord!');
            else if (e.code === 4004) return this.log.error('Failed to authenticate with Discord!').then(() => { process.exit(); });
            else { this.log.error(`Disconnected from Discord (${e.code})`); }

            process.exit().then(() => this.login());
        });

        process.on('exit', () => process.exit().then(() => this.login()));
        process.on('unhandledRejection', err => { console.error(err); });
    }

    async login(token) {        
        config();

        token = token || process.env.TOKEN;

        this.init() && super.login(token);
    }

    async init() {
        this.log.message('Succesfully deployed!', 'LenoxClient');

        return this.loadCommands() && this.loadEvents();
    }

    async loadCommands(dir = './src/commands/') {
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

    loadEvents(dir = './src/events') {
        readdir(dir, (err, files) => {
            if (err) return console.error(err);

            files.forEach(e => {
                const event = new (require(`../events/${e}`))(this);

                super.on(e.split('.')[0], (...args) => event.run(...args));
            });
        });
    }

    runCommand (context, args, command) {
        command.$run(context, args).catch(err => console.error(err));
    }
};