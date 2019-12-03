module.exports = {
    Client: require('./structures/Client'),
    Permissions: require('./structures/Permissions'),

    // Command Structure
    Command: require('./structures/Command/Structure'),
    Context: require('./structures/Command/Context'),

    // Other
    Constants: require('./utils/Constants'),
    Language: require('./utils/Translate'),
    Embed: require('./structures/Embed'),
    Search: require('./structures/Search'),
};

module.exports.Language.load();