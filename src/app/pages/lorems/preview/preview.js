import {ref} from 'vue';

import moment from 'moment';

import router from '@/router';
import Versions from './versions/Versions.vue';
import LocalStore from '@/_reactivestack/store/local.store';
import {sendGet} from '@/functions/send.fetch';

export default {
	name: 'Preview',
	components: {Versions},

	setup() {
		const store = ref(LocalStore.getStore());

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
