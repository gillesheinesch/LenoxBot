const { guild, user, client, market } = require('../models');
const { database: { uri } } = require('../utils/Constants');

const mongoose = require('mongoose');

module.exports = class Database {
    constructor() {
        this._ = mongoose.createConnection(uri, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

        // Models \\
        this.guild = this._.model("Guild", guild);
        this.user = this._.model("User", user);
        this.market = this._.model("Market", market);
        this.client_ = this._.model("Client", client);
    }

    addGuild(_) {
        let data = Object.assign({ _id: mongoose.Types.ObjectId() }, _);
        let guild = new (this).guild(data);

        return guild.save().then(() => { console.log(`Guild [${_.id}] was successfully added to the database.`, 'Mongoose'); }).catch(err => { console.error(err); });
    }

    async updateGuild(id, data) {
        let guild = await this.getGuild(id);

        if (typeof guild !== 'object') return;
        for (const key in data) { if (guild[key] !== data[key]) guild[key] = data[key]; else return; }

        return await this.guild.updateOne({ id }, guild);
    }

    async getGuild(id, path = false) {
        let guild = await this.guild.findOne({ id });
        if (!guild) guild = this.addGuild({ id });
        return path ? guild[path] : guild;
    }

    async deleteGuild(_) {
        return await this.guild.findOneAndRemove({ id: _ }).then(() => { console.log(`Guild [${_}] was successfully removed from the database.`, 'Mongoose'); }).catch(err => { console.error(err); });
    }
};