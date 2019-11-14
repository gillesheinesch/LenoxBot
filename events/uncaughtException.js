module.exports = {
  emitter: process,
  run: (error) => {
    if (!client.ready || !client.settings || !client.settings.log_channels || !client.settings.log_channels.errors || !error) return;
    const errorMsg = (error ? error.stack || error : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
    if (client.channels.has(client.settings.log_channels.errors)) {
      client.channels.get(client.settings.log_channels.errors).send(null, {
        embed: {
          color: 15684432,
          timestamp: new Date(),
          title: 'Uncaught Exception',
          description: `\`\`\`x86asm\n${errorMsg.slice(0, 2048)}\n\`\`\``,
          fields: [
            {
              name: 'Error Name:',
              value: `\`${error.name || 'N/A'}\``
            }, {
              name: 'Error Message:',
              value: `\`${error.message || 'N/A'}\``
            }
          ]
        }
      }).catch(console.error);
    }
  }
};
