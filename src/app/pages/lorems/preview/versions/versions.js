import {onUnmounted, ref} from 'vue';

import _ from 'lodash';
import moment from 'moment';

import ReactiveStore from '@/_reactivestack/store/reactive.store';

export default {
	name: 'PreviewVersions',
	setup() {
		const reactiveStore = new ReactiveStore('PreviewVersions-Store');
		const store = ref(reactiveStore.getStore());
		onUnmounted(() => reactiveStore.destroy());

		const isSelected = (lorem) => _.get(lorem, '_id', 1) === _.get(store.value.selectedLorem, '_id', 2);

		return {
			store,
			isSelected,
			getVersions: () => store.value.selectedLoremVersions,
			getRowClass: (lorem) => (isSelected(lorem) ? 'active' : ''),
			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),
			selectRow: (lorem) => {
				store.value.selectedLorem = lorem;
				reactiveStore.updateSubscription('selectedLorem', {
					query: {_id: lorem._id}
				});
			}
		};
	}
};
