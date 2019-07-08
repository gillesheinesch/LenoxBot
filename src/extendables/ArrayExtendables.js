const { Extendable } = require('klasa');

module.exports = class extends Extendable {
	constructor(...args) {
		super(...args, { appliesTo: [Array] });
	}

	static filterDuplicates(...array) {
		array = array.flat();
		const unique = {};
		array.forEach(i => {
			if (!unique[i]) unique[i] = true;
		});
		return Object.keys(unique);
	}

	removeValue(value) {
		const array = [...this];
		array.splice(array.indexOf(value), 1);
		return array;
	}
};
