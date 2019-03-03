const Enmap = require('enmap');
const sql = require('sqlite');
const mongodb = require('mongodb');
const usersettingskeys = require('../usersettings-keys.json');
const guildsettingskeys = require('../guildsettings-keys.json');

function migrate() {
	process.stdout.write('This process may take a while, press any to start the process. Do not stop it before it finishes!');
	process.stdin.setRawMode(true);

	process.stdin.once('data', data => {
		process.stdin.setRawMode(false);

		const byteArray = [...data];
		if (byteArray.length > 0 && byteArray[0] === 3) {
			console.log('^C');
			process.exit(1);
		}

		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write('1/3 Loading db botconfs...');
		const botconfs = new Enmap({
			name: 'botconfs',
			fetchAll: true
		});

		botconfs.defer.then(() => {
			process.stdout.cursorTo(0);
			process.stdout.write('1/3 Loading db userdb...');
			const userdb = new Enmap({
				name: 'userdb',
				fetchAll: true
			});
			userdb.defer.then(() => {
				process.stdout.cursorTo(0);
				process.stdout.write('1/3 Loading db guildsettings...');
				const guildconfs = new Enmap({
					name: 'guildsettings',
					fetchAll: true
				});

				guildconfs.defer.then(async () => {
					const settingsFile = require('../settings.json');
					this.url = `mongodb://${encodeURIComponent(settingsFile.db.user)}:${encodeURIComponent(settingsFile.db.password)}@${encodeURIComponent(settingsFile.db.host)}:${encodeURIComponent(settingsFile.db.port)}/?authMechanism=DEFAULT&authSource=admin`;
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

					process.stdout.cursorTo(0);
					process.stdout.write('2/3 Converting botconfs...');

					let settings = {};

					for (var [key, value] of botconfs) {
						settings[key] = value;
					}
					botSettingsCollection.insertOne({ botconfs: 'botconfs', settings: settings });

					settings = {};

					process.stdout.cursorTo(0);
					process.stdout.write('2/3 Converting guildSettings...');

					for (var [key, value] of guildconfs) {
						settings[key] = value;
					}
					guildSettingsCollection.insertOne({ guildId: key, settings: value });

					settings = {};

					process.stdout.cursorTo(0);
					process.stdout.write('2/3 Converting userdb...');

					for (var [key, value] of userdb) {
						settings[key] = value;
					}
					userSettingsCollection.insertOne({ userId: key, settings: value });

					process.stdout.cursorTo(0);
					process.stdout.write('3/3 Loading sqlite db for credits and xp');

					const db = await sql.open(`${settingsFile.sqlitefilename}.sqlite`);
					db.get('SELECT * FROM medals').then(async row => {
						if (row) {
							const result = await userSettingsCollection.findOne({ userId: row.userId });
							let settings = undefined;

							if (result) {
								settings = result.settings;
							} else {
								settings = usersettingskeys;

								userSettingsCollection.insertOne({ userId: row.userId, settings: settings });
							}

							settings.credits = row.medals;
							userSettingsCollection.updateOne({ userId: row.userId }, { $set: { settings: settings } });
						}

						db.get('SELECT * FROM scores').then(async row => {
							if (row) {
								const result = await guildSettingsCollection.findOne({ guildId: row.guildId });
								let settings = undefined;

								if (!result) {
									settings = guildsettingskeys;

									guildSettingsCollection.insertOne({ guildId: row.guildId, settings: settings });
								} else {
									settings = result.settings;
								}

								const currentScores = settings.scores;
								currentScores[row.userId] = {};
								currentScores[row.userId].points = row.points;
								currentScores[row.userId].level = row.level;
								guildSettingsCollection.updateOne({ guildId: row.guildId }, { $set: { settings: settings } });
							}

							process.stdout.cursorTo(0);
							process.stdout.write('3/3 Finalizing...\n');
							this.dbClient.close();

							console.log('Migration done.');

							process.exit(0);
						});
					});
				});
			});
		});
	});
}

migrate();
