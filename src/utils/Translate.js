const { readdir, readFileSync } = require('fs');

const languages = module.exports.languages = new Map();

module.exports = class Translate {
    static load () {
        readdir('./locales/', (err, files) => {
            if (err) return console.error(err);

            files.forEach(l => {
                const language_name = l.split('.')[0];

                languages.set(language_name, JSON.parse(readFileSync(`./locales/${l}`, "utf8")));
            });
        });
    }

    static t(dir, language = "en-US") {
        function getKey (object, lng) {
            if (object.length > 0) {
                language = lng[object[0]];

                if (!language) return `A invalid key was supplied, report this error to the official support server!\nKey: [${dir}]`;
                return getKey(object.slice(1), language);
            }
            return language;
        }

        return getKey(dir.split('.'), languages.set(language));
    }
}