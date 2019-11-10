const { RichEmbed } = require('discord.js');

const { default_color } = require('../utils/Constants');

module.exports = class Embed extends RichEmbed {
    constructor(user, data = {}) {
        super(data);

        this.setColor(default_color).setTimestamp();

        if (user) this.setFooter(user.tag);
    }
}