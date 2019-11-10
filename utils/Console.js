module.exports = class Console {
    static message (...args) {
        const message = '[32m' + args[0] + '[0m';
        const tags = args.slice(1).map(t => `[36m[[31m${t}[36m][0m`);

        return console.log(...tags, message);
    }

    static error (...args) {
        const message = '[31m' + args[0] + '[0m';

        return console.error('[36m[[31mError[36m]', message);
    }
}