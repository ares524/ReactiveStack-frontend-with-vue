import {ref} from 'vue';

import Header from './pages/header/Header.vue';
import GlobalStore from '@/_reactivestack/store/global.store';

export default {
	name: 'App',
	components: {Header},

	setup() {
		const store = ref(GlobalStore.getStore());
		// GlobalStore.addTarget('some_name', 'some_collection', []);

		return {
			store
		};
	}
};

// https://www.digitalocean.com/community/tutorials/vuejs-component-lifecycle
