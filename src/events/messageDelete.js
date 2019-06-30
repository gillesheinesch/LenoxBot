const { Event } = require('klasa');

module.exports = class extends Event {
	async run(message) {
		if (this.client.ready) {
			if (message.guild && message.guild.me && message.guild.me.permissions.has('VIEW_AUDIT_LOG', true)) {
				const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first());
				let user = '';
				try {
					if (entry.extra.channel.id === message.channel.id && (entry.target.id === message.author.id) && (entry.createdTimestamp > (Date.now() - 5000)) && (entry.extra.count >= 1)) {
						user = entry.executor;
					} else {
						user = message.author;
					}
				} catch (e) {
					user = message.author;
				}
				message.deleted_by = user;
			} // if client has `VIEW_AUDIT_LOG` permission then it will get who deleted the message and apply the property `deleted_by` to the message object then store it into `this.client.deted`
			this.client.deleted.set(message.id, message);
		}

		if (message.command && message.command.deletable) {
			for (const msg of message.responses) {
				if (!msg.deleted) msg.delete();
			}
		}
	}
};
