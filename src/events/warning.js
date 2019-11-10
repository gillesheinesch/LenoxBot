module.exports = {
	emitter: process,
	run: (warning) => {
		try {
			if (!client.ready || !client.settings || !client.settings.log_channels || !client.settings.log_channels.warnings) return console.warn(warning.toString());
			if (client.channels.has(client.settings.log_channels.warnings)) client.channels.get(client.settings.log_channels.warnings).send(null, {
				embed: {
					color: 12696890,
					timestamp: new Date(),
					title: 'Process Warning',
					description: warning.stack ? `\`\`\`x86asm\n${warning.stack}\n\`\`\`` : '`N/A`',
					fields: [
						{
							name: 'Warning:',
							value: `\`${warning.toString() || 'N/A'}\``
						}, {
							name: 'Warning Name:',
							value: `\`${warning.name || 'N/A'}\``
						}, {
							name: 'Warning Message:',
							value: `\`${warning.message || 'N/A'}\``
						}
					]
				}
			});
		} catch (error) {
			console.error(error.toString());
		}
	}
}
