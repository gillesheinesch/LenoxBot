const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: [Array] });
	}

	static filterDuplicates(...array) {
		array = array.flat();
		let unique = {};
		array.forEach((i) => {
			if (!unique[i]) unique[i] = true;
		});
		return Object.keys(unique);
	}
}