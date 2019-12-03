module.exports = {
    id: String,

    credits: { type: Number, default: 0 },
    description: { type: String, default: 'None' },
    badges: { type: Array, default: [] },

    inventory: {
        type: Object, default: {
            items: {
                type: Object, default: {
                    crate: { type: Number, default: 0 },
                    cratekey: { type: Number, default: 0 },
                    pickaxe: { type: Number, default: 0 },
                    joystick: { type: Number, default: 0 },
                    house: { type: Number, default: 0 },
                    bag: { type: Number, default: 0 },
                    diamond: { type: Number, default: 0 },
                    dog: { type: Number, default: 0 },
                    cat: { type: Number, default: 0 },
                    apple: { type: Number, default: 0 },
                    football: { type: Number, default: 0 },
                    car: { type: Number, default: 0 },
                    phone: { type: Number, default: 0 },
                    computer: { type: Number, default: 0 },
                    camera: { type: Number, default: 0 },
                    clock: { type: Number, default: 0 },
                    rose: { type: Number, default: 0 },
                    umbrella: { type: Number, default: 0 },
                    hamburger: { type: Number, default: 0 },
                    croissant: { type: Number, default: 0 },
                    basketball: { type: Number, default: 0 },
                    watch: { type: Number, default: 0 },
                    projector: { type: Number, default: 0 },
                    flashlight: { type: Number, default: 0 },
                    bed: { type: Number, default: 0 },
                    hammer: { type: Number, default: 0 },
                    book: { type: Number, default: 0 },
                    mag: { type: Number, default: 0 },
                    banana: { type: Number, default: 0 },
                    inventoryextended: { type: Number, default: 0 },
                    tractor: { type: Number, default: 0 },
                    syringe: { type: Number, default: 0 },
                    gun: { type: Number, default: 0 },
                    knife: { type: Number, default: 0 },
                    airplane: { type: Number, default: 0 },
                    trophy: { type: Number, default: 0 },
                    lock: { type: Number, default: 0 },
                    bell: { type: Number, default: 0 },
                    shirt: { type: Number, default: 0 },
                    lipstick: { type: Number, default: 0 },
                    ring: { type: Number, default: 0 },
                    sandal: { type: Number, default: 0 },
                    boots: { type: Number, default: 0 },
                    fries: { type: Number, default: 0 },
                    pizza: { type: Number, default: 0 },
                    hotdog: { type: Number, default: 0 },
                    sushi: { type: Number, default: 0 },
                    guitar: { type: Number, default: 0 },
                    bus: { type: Number, default: 0 },
                    scooter: { type: Number, default: 0 },
                    keyboard: { type: Number, default: 0 },
                    mailbox: { type: Number, default: 0 },
                    paperclip: { type: Number, default: 0 },
                    scissors: { type: Number, default: 0 }
                }
            },
            slots: { type: Number, default: 30 }
        }
    },

    premium: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            bought: { type: Array, default: [] },
            end: { type: String, default: '0' }
        }
    },

    socialmedia: {
        type: Object, default: {
            instagram: { type: String, default: '0' },
            twitter: { type: String, default: '0' },
            youtube: { type: String, default: '0' },
            twitch: { type: String, default: '0' },
            facebook: { type: String, default: '0' },
            github: { type: String, default: '0' },
            pinterest: { type: String, default: '0' },
            reddit: { type: String, default: '0' }
        }
    },

    currentReminder: { type: Array, default: [] },
    dailyreminder: { type: Boolean, default: false },
    jobstatus: { type: Boolean, default: false },
    creditsmessage: { type: Boolean, default: false },
    doubleLootAndDaily: { type: Boolean, default: false },

    achivements: {
        type: Object, default: {
            firstBuy: { type: Boolean, default: false },
            firstSell: { type: Boolean, default: false },
        }
    },

    math: {
        type: Object, default: {
            points: { type: Number, default: 0 },
            level: { type: Number, default: 0 }
        }
    },

    dailystreak: {
        type: Object, default: {
            streak: { type: Number, default: 0 },
            lastpick: { type: String, default: '0' },
            deadline: { type: String, default: '0' }
        }
    },

    stats: {
        loot: { type: Number, default: 0 },
        daily: { type: Number, default: 0 },
        dailystreakhighest: { type: Number, default: 0 },
        mine: { type: Number, default: 0 },
        creditshighestcredits: { type: Number, default: 0 },
        creditshighestrank: { type: Number, default: 0 },
        slot: { type: Number, default: 0 },
        gamble: { type: Number, default: 0 },
        gamblehighestwin: { type: Number, default: 0 },
        job: { type: Number, default: 0 },
        openedcrates: { type: Number, default: 0 },
        templesearch: { type: Number, default: 0 }
    }
};