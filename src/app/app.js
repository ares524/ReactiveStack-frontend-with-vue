import Header from './pages/header/Header.vue';
import GlobalStore from '@/_reactivestack/store/global.store';

export default {
	name: 'App',
	components: {Header},

	setup() {
		GlobalStore.init().then(() => {
			// sendSubscribe...target, config
		});
		// GlobalStore.addTarget('some_name', 'some_collection', []);
		// const store = ref(GlobalStore.getStore());

		return {};
	}
};

// https://www.digitalocean.com/community/tutorials/vuejs-component-lifecycle
