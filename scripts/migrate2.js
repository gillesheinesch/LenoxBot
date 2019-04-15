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
		process.stdout.write('1/3 Migrate script...');

		async function migrate2() {
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

			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write('1/3 Loading sqlite db for credits and xp');

			const db = await sql.open(`${settingsFile.sqlitefilename}.sqlite`);
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write('1/3 Loaded sqlite db for credits and xp');

			await db.each('SELECT * FROM medals', async (err, row) => {
				const result = await userSettingsCollection.findOne({ userId: row.userId });
				let settings = undefined;

				if (result && result.settings) {
					settings = result.settings;
				} else {
					settings = usersettingskeys;

					await userSettingsCollection.insertOne({ userId: row.userId, settings: settings });
				}

				settings.credits = row.medals;
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
				process.stdout.write(`2/3 Converting credits of user ${row.userId}\n`);
				await userSettingsCollection.updateOne({ userId: row.userId }, { $set: { settings: settings } });
			});

			/*await db.each('SELECT * FROM scores', async (err, row) => {
				const result = await guildSettingsCollection.findOne({ guildId: row.guildid });
				let settings = undefined;

				if (!result || !result.settings) {
					settings = guildsettingskeys;

					await guildSettingsCollection.insertOne({ guildId: row.guildid, settings: settings });
				} else {
					settings = result.settings;
				}

				// This doesn't exist in the normal layout of the old db, so we need to create it.
				if (!settings.scores) {
					settings.scores = {};
				}
				const currentScores = settings.scores;
				currentScores[row.userId] = {};
				currentScores[row.userId].points = row.points;
				currentScores[row.userId].level = row.level;
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
				process.stdout.write(`2/3 Converting score of user ${row.userId}\n`);
				await guildSettingsCollection.updateOne({ guildId: row.guildid }, { $set: { settings: settings } });
			});*/
		}
		migrate2();
	});
}

migrate();
