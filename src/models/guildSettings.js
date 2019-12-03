module.exports = {
    prefix: { type: String, default: '?' },
    language: { type: String, default: 'en-US' },

    nicknames: { type: Array, default: [] },

    premium: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            bought: { type: Array, default: [] },
            end: { type: String, default: '0' }
        }
    },

    modules: {
        type: Object, default: {
            fun: { type: Boolean, default: true },
            help: { type: Boolean, default: true },
            moderation: { type: Boolean, default: true },
            music: { type: Boolean, default: true },
            nsfw: { type: Boolean, default: true },
            searches: { type: Boolean, default: true },
            utility: { type: Boolean, default: true },
            application: { type: Boolean, default: true },
            currency: { type: Boolean, default: true },
            customcommands: { type: Boolean, default: true },
            tickets: { type: Boolean, default: true }
        }
    },

    autorole: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            roles: { type: Array, default: [] }
        }
    },
    modrole: {
        type: Object, default: {
            active: { type: Boolean, default: true },
            role: { type: String, default: "0" }
        }
    },

    welcome: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            channel: { type: String, default: "0" },
            message: { type: String, default: "Welcome {{user}} to {{guild}}!" }
        }
    },

    goodbye: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            channel: { type: String, default: "0" },
            message: { type: String, default: "Goodbye {{user}}!" }
        }
    },

    modlogchannel: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            channel: { type: String, default: "0" }
        }
    },

    logchannel: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            channel: { type: String, default: "0" }
        }
    },

    musicchannel: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            channel: { type: String, default: "0" }
        }
    },

    xpchannel: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            channel: { type: String, default: "0" }
        },
    },

    logs: {
        type: Object, default: {
            message_delete: { type: Boolean, default: false },
            message_delete_channel: { type: String, default: "0" },
            message_update: { type: Boolean, default: false },
            message_update_channel: { type: String, default: "0" },
            channel_update: { type: Boolean, default: false },
            channel_update_channel: { type: String, default: "0" },
            channel_create: { type: Boolean, default: false },
            channel_create_channel: { type: String, default: "0" },
            channel_delete: { type: Boolean, default: false },
            channel_delete_channel: { type: String, default: "0" },
            guild_member_update: { type: Boolean, default: false },
            guild_member_update_channel: { type: String, default: "0" },
            presence_update: { type: Boolean, default: false },
            presence_update_channel: { type: String, default: "0" },
            member_join: { type: Boolean, default: false },
            member_join_channel: { type: String, default: "0" },
            guild_update: { type: Boolean, default: false },
            guild_update_channel: { type: String, default: "0" },
            member_leave: { type: Boolean, default: false },
            member_leave_channel: { type: String, default: "0" },
            role_create: { type: Boolean, default: false },
            role_create_channel: { type: String, default: "0" },
            role_delete: { type: Boolean, default: false },
            role_delete_channel: { type: String, default: "0" },
            role_update: { type: Boolean, default: false },
            role_update_channel: { type: String, default: "0" }
        }
    },

    swears: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            list: { type: Array, default: [] }
        }
    },

    notifications: {
        type: Object, default: {
            active: { type: Boolean, default: false },
            channel: { type: String, default: "0" }
        }
    },

    minigames: { type: Boolean, default: false },
    xpmessages: { type: Boolean, default: false },

    auditlogs: { type: Array, default: [] },
    selfassignableroles: { type: Array, default: [] },
    customcommands: { type: Array, default: [] },

    application: {
        type: Object, default: {
            reactionnumber: { type: Number, default: 0 },
            template: { type: Array, default: [] },
            role: { type: String, default: '0' },
            status: { type: Boolean, default: false },
            applicationid: { type: Number, default: 0 },
            applications: { type: Object, default: {} },
            acceptedmessage: { type: String, default: 'default' },
            rejectedmessage: { type: String, default: 'default' },
            notificationstatus: { type: Boolean, default: false },
            notificationchannel: { type: String, default: '0' },
            denyrole: { type: String, default: '0' }
        }
    }

};