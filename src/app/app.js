import Header from './pages/header/Header.vue';
import StoreTargets from '@/_reactivestack/store/store.targets';
import GlobalStore from '@/_reactivestack/store/global.store';

export default {
	name: 'App',
	components: {Header},

	setup() {
		const storeTargets = new StoreTargets();

		// TODO:
		GlobalStore.init(storeTargets).then(() => {
			// sendSubscribe...target, config
		});

		return {};
	}
};

// https://www.digitalocean.com/community/tutorials/vuejs-component-lifecycle
