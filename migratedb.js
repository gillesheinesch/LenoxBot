const Enmap = require('enmap');

process.stdout.write('1/2 Loading db...');
const botconfs = new Enmap({
	name: 'botconfs',
	fetchAll: true
});

process.stdout.write('1/2 Loading db...');

botconfs.defer.then(() => {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write('2/2 Converting botconfspremiumload to new generator');

	const botconfspremiumload = botconfs.get('premium');

	botconfspremiumload.keys.guildkeys = [];
	botconfspremiumload.keys.userkeys = [];

	botconfs.set('premium', botconfspremiumload);

	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write('Migration done.\n');

	botconfs.close();

	process.exit(0);
});
