const { Command, Embed, Search: { member } } = require('../../');

module.exports = class Info extends Command {
    constructor (client) {
        super(client, {
            name: 'userinfo',
            aliases: ['ui'],
            usage: ['username', 'id', '@mention'],
            description: '',
        });
    }

    async run ({ channel, author, t, language, guild }, args) {
        const embed = new Embed(author);
        const user = member(args.join(' '), { t, language, author, guild });

        const charLimit = (s) => s.length > 1024 ? `${s.substr(0, 1020)}...` : s;
        const filter = this.client.guilds.filter(g => g.members.has(user.id)).map(g => `**${g.name}**`);

        embed.setTitle(`**${typeof user.displayName === 'undefined' ? user.username : user.displayName}**`)
            .setThumbnail(typeof user.displayAvatarURL === 'undefined' ? user.user.displayAvatarURL : user.displayAvatarURL)
            .addField(t('commons.tag', language), `[**${typeof user.tag === 'undefined' ? user.user.tag : user.tag}**](${typeof user.displayAvatarURL === 'undefined' ? user.user.displayAvatarURL : user.displayAvatarURL})`, true)
            .addField(t('commands.userinfo.serversInCommon', language) + ` [**${filter.length}**] `, charLimit(filter.join(', ')));

        channel.send(embed);
    }
};