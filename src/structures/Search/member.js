const CommandError = require('../Command/Error');

const regex = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/;

module.exports = class Member {
    static parse(args, { t, language, author, guild }, options = { acceptSelf: true, acceptBot: true }) {
        if (!args && options.acceptSelf) return author; 
        else if (!args && !options.acceptSelf) throw new CommandError(t('errors.acceptSelf'), language);

        const r = regex.exec(args);
        const id = r && r[1];
        const findUser = guild.members.find(m => m.user.username.toLowerCase().includes(args.toLowerCase()) || m.displayName.toLowerCase().includes(args.toLowerCase()));
        
        const user = guild.members.get(id) || (!!findUser && findUser.user);
        const member = guild.member(user);

        if (!member) throw new CommandError(t('errors.userNotFound'), language);
        if (!options.acceptSelf && member.id === author.id) throw new CommandError(t('errors.acceptSelf', language)); 
        if (!options.acceptBot && member.bot) throw new CommandError(t('errors.acceptBot', language));

        return member;
    }
};