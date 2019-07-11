const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

  constructor(...args) {
    super(...args, { route: 'commands' });
  }

  get(request, response) {
    return response.end(JSON.stringify(this.client.commands));
  }
}