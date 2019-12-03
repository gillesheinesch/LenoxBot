const { Command } = require('../../');

module.exports = class Info extends Command {
    constructor (client) {
        super(client, {
            name: 'info',
            aliases: ['botinfo'],
            description: '',
        });
    }

    async run () {

    }
};