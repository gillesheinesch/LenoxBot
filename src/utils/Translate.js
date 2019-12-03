const { readdir, readFileSync } = require('fs');

const languages = new Map();

module.exports = class Translate {
    static load(dir = './src/locales/') {
        readdir(dir, (err, files) => {
            if (err) return console.error(err);

            files.forEach(lng => {
                let language_name = lng.split('.')[0];
                
                languages.set(language_name, JSON.parse(readFileSync(dir + lng, "utf8")));
            });
        });
    }

    static t(dir, lang = "en-US") {
        function getKey(object, Language) {
            if (object.length > 0) {
                lang = Language[object[0]];

                if (!lang) return `\`\`\`\nA invalid key was supplied, report this error to the official support server. \nKey: [${dir}]\n\`\`\``;
                return getKey(object.slice(1), lang);
            }
            return lang;
        }

        return getKey(dir.split('.'), languages.get(lang));
    }
};

module.exports.languages = languages;