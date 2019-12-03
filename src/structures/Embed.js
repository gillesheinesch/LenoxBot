const { RichEmbed } = require('discord.js');
const { color } = require('../utils/Constants');

module.exports = class Embed extends RichEmbed {
    constructor (author, data = {}) {
        super(data);

        this.setColor(color).setTimestamp();

        if (author) this.setFooter(author.tag);
    }
};