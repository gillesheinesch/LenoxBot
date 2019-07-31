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

	static arraySum(array) {
		if (!Array.isArray(array)) throw new TypeError(`array-sum expects an Array as the first argument, instead got ${array.constructor.name ? array.constructor.name : typeof (array)}!`);
		let length = array.length;
		let res = 0;
		while (length--) {
			let number = array[length];
			if (Number.isNumber(number)) res += (+number);
		}
		return res;
	}
};
