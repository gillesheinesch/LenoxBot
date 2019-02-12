const Enmap = require('enmap');
const settings = require('../settings.json');

process.stdout.write('This process may take a while, press any to start the process. Do not stop it before it finishes!');
process.stdin.setRawMode(true);

process.stdin.once('data', (data) => {
    process.stdin.setRawMode(false);

    const byteArray = [...data]
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C')
      process.exit(1)
    }

    const SettingsProvider = new SettingsProvider(settings);

    process.stdout.write('1/2 Loading db botconfs...');
    const botconfs = new Enmap({
        name: 'botconfs',
        fetchAll: true
    })

    botconfs.defer.then(() => {
        process.stdout.write('1/2 Loading db userdb...');
        const userdb = new Enmap({
            name: 'userdb',
            fetchAll: true
        })
        userdb.defer.then(() => {
            process.stdout.write('1/2 Loading db guildsettings...');
            const guildconfs = new Enmap({
                name: 'guildsettings',
                fetchAll: true
            })

            guildconfs.defer.then(() => {
                this.url = `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/?authMechanism=DEFAULT&authSource=admin`;
                try {
                    this.dbClient = await mongodb.MongoClient.connect(this.url, { useNewUrlParser: true });
                } catch (err) {
                    console.log(err);
                    process.exit(-1);
                }

                this.db = this.dbClient.db('lenoxbot');
                const guildSettingsCollection = this.db.collection('guildSettings');
                const userSettingsCollection = this.db.collection('userSettings');
                const botSettingsCollection = this.db.collection('botSettings');

                await guildSettingsCollection.createIndex('guildId', { unique: true });
                await userSettingsCollection.createIndex('userId', { unique: true });
                await botSettingsCollection.createIndex('botconfs', { unique: true });

                process.stdout.write('2/2 Converting botconfs...');
                
                let settings = {}

                for(var[key, value] of botconfs) {
                    settings[key] = value;
                }
                botSettingsCollection.insertOne({botconfs: 'botconfs', settings: settings});

                process.stdout.write('2/2 Converting guildSettings...');

                for(var[key, value] of guildconfs) {
                    guildSettingsCollection.insertOne({guildId: key, settings: value});
                }

                process.stdout.write('2/2 Converting userdb...');

                for(var[key, value] of userdb) {
                    userSettingsCollection.insertOne({userId: key, settings: value});
                }

                process.stdout.write('2/2 Finalizing...');
                dbClient.close();

                console.log("Migration done.")

                process.exit(0);
            })
        })
    })
})

