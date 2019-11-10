const rf = require('random-facts');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class randomfactCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'randomfact',
      group: 'searches',
      memberName: 'randomfact',
      description: 'Random facts (in English only)',
      format: 'randomfact',
      aliases: [],
      examples: ['randomfact'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  run(msg) {
    msg.channel.send(rf.randomFact());
  }
};
