import {onUnmounted, ref} from 'vue';

import moment from 'moment';

import router from '@/router';
import Versions from './versions/Versions.vue';
import ReactiveStore from '@/_reactivestack/store/reactive.store';
import {sendGet} from '@/functions/send.fetch';

export default {
	name: 'Preview',
	components: {Versions},

	setup() {
		const reactiveStore = new ReactiveStore('Preview-Store');
		const store = ref(reactiveStore.getStore());
		onUnmounted(() => reactiveStore.destroy());

		return {
			store,

			momentDate: (date) => moment(date).format('YYYY/MM/DD HH:mm:ss'),
			editLorem: async () => {
				const draftId = await sendGet('/api/draft/create/lorems/' + store.value.selectedLorem._id);
				router.push('/lorem/' + draftId);
			}
		};
	}
};
