import {ref, onMounted, onUnmounted} from 'vue';

import _ from 'lodash';
import moment from 'moment';

import Preview from './preview/Preview.vue';
import Controls from './controls/Controls.vue';

import AuthService from '@/_reactivestack/auth.service';
import LocalStore from '@/_reactivestack/store/local.store';
import gridSearchConfigFactory from '@/_reactivestack/_f.grid.search.config.factory';

const _toggleSortingHelper = (sorting, label) => {
	let sortingLabel = _.get(sorting, label, false);
	if (sorting && sortingLabel) {
		if (sortingLabel < 0) _.set(sorting, label, 1);
		else if (sortingLabel > 0) _.set(sorting, label, 0);
		else _.set(sorting, label, -1);
		return sorting;
	}

	_.set(sorting, label, -1);
	return sorting;
};

const COLUMNS = {
	firstname: {type: 'string'},
	lastname: {type: 'string'},
	email: {type: 'string'},
	description: {type: 'string'},
	species: {type: 'string'},
	iteration: {type: 'number'},
	rating: {type: 'number'}
};

export default {
	name: 'Lorems',
	components: {Controls, Preview},

	setup() {
		LocalStore.init() //
			.then(() => {
				if (AuthService.loggedIn()) {
					LocalStore.sendSubscribe('lorems', gridSearchConfigFactory(COLUMNS));
				}
			});
		LocalStore.addTarget('lorems', 'lorems', []);
		LocalStore.addTarget('selectedLorem', 'lorems', {});
		LocalStore.addTarget('selectedLoremVersions', 'lorems', []);

		const store = ref(LocalStore.getStore());

		onMounted(() => console.log('lorems onMounted'));
		onUnmounted(() => console.log('lorems onUnmounted'));

		let page = ref(1);
		let pageSize = ref(10);
		let search = ref('');
		let sort = ref({createdAt: -1});

		const _setConfig = () => {
			const config = gridSearchConfigFactory(COLUMNS, {
				page: page.value,
				pageSize: pageSize.value,
				search: search.value,
				sort: sort.value
			});
			LocalStore.sendSubscribe('lorems', config);
		};

		const _isSelected = (lorem) =>
			!_.isEmpty(store.value.selectedLorem) && lorem.itemId === store.value.selectedLorem.itemId;

		const _unselect = () => {
			store.value.selectedLorem = {};
			store.value.selectedLoremVersions = [];
			LocalStore.sendUnsubscribe('selected');
			LocalStore.sendUnsubscribe('selectedLoremVersions');
		};

		const _select = (lorem) => {
			store.value.selectedLorem = lorem;
			store.value.selectedLoremVersions = [];

			LocalStore.sendSubscribe('selectedLorem', {
				query: {
					itemId: lorem.itemId,
					isLatest: true
				}
			});

			LocalStore.sendSubscribe('selectedLoremVersions', {
				query: {itemId: lorem.itemId},
				sort: {iteration: -1}
			});
		};

		return {
			store,
			page,
			pageSize,
			search,
			sort,

			getRowClass: (lorem) => (_isSelected(lorem) ? 'active' : ''),
			hasSelected: () => !_.isEmpty(store.value.selectedLorem),
			truncate: (text) => _.truncate(text, {length: 75, separator: ' '}),
			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),

			getIcon: (label) => {
				let sortingLabel = sort.value[label];
				if (sortingLabel < 0) return 'fa fa-long-arrow-down icon';
				if (sortingLabel > 0) return 'fa fa-long-arrow-up icon';
				return 'fa fa-blank icon';
			},

			resendConfig: _.throttle(
				function (controls) {
					_unselect();

					let {page: pageValue, pageSize: pageSizeValue, search: searchValue} = controls;
					page.value = pageValue;
					pageSize.value = pageSizeValue;
					search.value = searchValue;

					_setConfig();
				},
				100,
				{leading: true, trailing: true}
			),

			selectRow: (lorem) => {
				if (_isSelected(lorem)) _unselect();
				else _select(lorem);
			},

			toggleSorting: (label) => {
				let sorting = _.cloneDeep(sort.value);
				if (label === 'firstname') {
					sorting = _toggleSortingHelper(sorting, 'firstname');
					sorting = _toggleSortingHelper(sorting, 'lastname');
				} else {
					sorting = _toggleSortingHelper(sorting, label);
				}

				if (sorting['createdAt']) {
					let createdAt = sorting['createdAt'];
					delete sorting['createdAt'];
					sorting['createdAt'] = createdAt;
				}
				sorting = _.pickBy(sorting, _.identity);
				sort.value = sorting;

				_setConfig();
			}
		};
	}
};
