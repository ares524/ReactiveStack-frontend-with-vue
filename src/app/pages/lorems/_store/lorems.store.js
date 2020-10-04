import _ from 'lodash';
import {reactive} from 'vue';

export const loremsStore = reactive({
	lorems: [],
	loremsCount: 0,
	loremsTotalCount: 0,
	selectedLorem: {},
	selectedLoremVersions: [],

	reset() {
		this.lorems = [];
		this.loremsCount = 0;
		this.loremsTotalCount = 0;
		this.selectedLorem = {};
		this.selectedLoremVersions = [];
	},

	setLorems(lorems) {
		this.lorems = _.concat([], lorems);
		this.loremsCount = _.size(lorems);
	},
	setLoremsTotalCount(count) {
		this.loremsTotalCount = count;
	},
	setSelectedLorem(selected) {
		this.selectedLorem = selected;
	},
	setSelectedLoremVersions(versions) {
		this.selectedLoremVersions = _.concat([], versions);
	}
});
