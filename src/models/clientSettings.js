module.exports = {
    reminder: { type: Object, default: {} },
    job: { type: Object, default: {} },
    market: { type: Object, default: {} },
    blacklist: { type: Array, default: [] },
    banlist: { type: Array, default: [] },
    tickets: {
        type: Object, default: {
            cases: { type: Number, default: 0 },
            logs: { type: Array, default: [] }
        }
    },
    badges: { type: Object, default: {} },
    premium: {
        type: Object, default: {
            keys: { type: Array, default: [] },
        }
    }
};