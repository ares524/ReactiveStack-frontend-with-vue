import _ from "lodash";

const _getCleanColumnNames = (columns, type) => {
	let clean = _.pickBy(columns, (v, k) => _.includes(v, type));
	clean = _.map(clean, (v, k) => k);
	return clean;
}

// TODO: add dates/ranges
const orFilterFactory = (search, columns) => {
	const stringColumns = _getCleanColumnNames(columns, 'string');
	const numberColumns = _getCleanColumnNames(columns, 'number');

	let or = _.map(stringColumns, (column) => {
		let q = {};
		_.set(q, column, {$regex: search, $options: 'i'});
		return q;
	});

	if (!isNaN(search)) {
		let number = _.toInteger(search);
		let numberOr = _.map(numberColumns, (column) => {
			let q = {};
			_.set(q, column, number);
			return q;
		});
		or = _.concat(or, numberOr);
	}

	return or;
};
export default orFilterFactory;