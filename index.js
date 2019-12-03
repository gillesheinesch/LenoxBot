const { Client } = require('./src');
const client = new Client({ fetchAllMembers: true, disableEveryone: true });

client.login();