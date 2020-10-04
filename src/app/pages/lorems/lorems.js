import {reactive} from 'vue';

import _ from 'lodash';
import moment from "moment";

import AuthService from "@/_reactivestack/auth.service";

import {loremsStore} from "./_store/lorems.store";
import LoremsUpdater from './_store/lorems.updater';

import Preview from './preview/Preview.vue';
import Controls from './controls/Controls.vue';

const _toggleSortingHelper = (sorting, label) => {
	let sortingLabel = _.get(sorting, label, false);
	if (sorting && sortingLabel) {
		if (sortingLabel < 0) _.set(sorting, label, 1);
		else if (sortingLabel > 0) _.set(sorting, label, 0);
		else _.set(sorting, label, -1);
	} else {
		_.set(sorting, label, -1);
	}
	return sorting;
}

let updater;

export default {
	name: 'Lorems',
	components: {
		Controls, Preview
	},

	store: loremsStore,

	setup() {
		return reactive({
			page: 1,
			pageSize: 10,
			search: '',
			sort: {createdAt: -1}
		});
	},

	methods: {
		resendConfig: _.throttle(function (controls) {
			if (!updater) return;
			updater.unselect();

			let {page, pageSize, search} = controls;
			this.page = page;
			this.pageSize = pageSize;
			this.search = search;

			this.setUpdaterConfig();
		}, 100, {'leading': true, 'trailing': true}),

		setUpdaterConfig() {
			if (updater) {
				updater.setConfig({page: this.page, pageSize: this.pageSize, search: this.search, sort: this.sort});
			}
		},

		selectRow(lorem) {
			if (this.$store.selectedLorem && lorem.itemId === this.$store.selectedLorem.itemId) {
				updater.unselect();
			} else {
				updater.select(lorem);
			}
		},
		toggleSorting(label) {
			let sorting = _.cloneDeep(this.sort);
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
			this.sort = sorting;

			this.setUpdaterConfig();
		},
		getIcon(label) {
			let sortingLabel = this.sort[label];
			if (sortingLabel < 0) return 'fa fa-long-arrow-down icon';
			if (sortingLabel > 0) return 'fa fa-long-arrow-up icon';
			return 'fa fa-blank icon';
		},
		getRowClass(lorem) {
			return this.$store.selectedLorem && lorem.itemId === this.$store.selectedLorem.itemId ? 'active' : '';
		},
		hasSelected() {
			return !_.isEmpty(this.$store.selectedLorem);
		},
		truncate(text) {
			return _.truncate(text, {'length': 75, 'separator': ' '});
		},
		momentDate(date) {
			return moment(date).format('YYYY/MM/DD HH:mm:ss');
		}
	},

	async beforeCreate() {
		console.log(' - beforeCreate Lorems');
		if (AuthService.loggedIn()) {
			if (updater) updater.destroy();
			updater = new LoremsUpdater();
			updater.setConfig();
		}
	},
	beforeRouteLeave(to, from, next) {
		console.log(' - beforeRouteLeave Lorems');
		this.$store.reset();
		if (updater) updater.destroy();
		updater = null;
		next();
	}
}
