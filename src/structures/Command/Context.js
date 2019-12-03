module.exports = class CommandContext {
    constructor (options = {}) {
        this.client = options.client;
        this.command = options.command;
        this.t = options.t;

        this.message = options.message;
        this.author = options.message.author;
        this.guild = options.message.guild;
        this.member = options.message.member;
        this.channel = options.message.channel;

        this.database = options.database;
        this.prefix = options.prefix;
        this.language = options.language;

        this.set = (data) => this.database.updateGuild(this.guild.id, data);
    }
};