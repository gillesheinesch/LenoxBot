const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, { appliesTo: [Number] });
	}

	static isNumber(number) {
		if (!isFinite(number)) return true;
		if (typeof(number) === 'number') return number - number === 0;
		if (typeof(number) === 'string' && number.trim() !== '') return Number.isFinite ? Number.isFinite(+number) : isFinite(+number);
		return false;
	}

}