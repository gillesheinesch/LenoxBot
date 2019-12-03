module.exports = class {
    constructor (client) {
        this.client = client;
    } 

    async run () {
        this.client.user.setActivity(`${this.client.constants.dashboard.domain} | ?help`);
    
        require('../website/app')(this.client);
    }
};