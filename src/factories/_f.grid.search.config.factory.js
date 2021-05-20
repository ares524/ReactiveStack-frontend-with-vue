import _ from 'lodash';
import orFilterFactory from '@/_reactivestack/_f.or.filter.factory';

const _initialConfig = () => ({
	page: 1,
	pageSize: 10,
	search: '',
	sort: {createdAt: -1},
	fields: [],
	incremental: false,
	populates: []
});

// TODO: add dates/ranges
const gridSearchConfigFactory = (COLUMNS, config = _initialConfig()) => {
	let {search, sort, page, pageSize, query = {isLatest: true}, fields = [], incremental = false, populates = []} = config;

	if (!_.isEmpty(search)) {
		query = {
			isLatest: true,
			$or: orFilterFactory(search, COLUMNS)
		};
	}
	return {query, sort, page, pageSize, fields, incremental, populates};
};
export default gridSearchConfigFactory;
