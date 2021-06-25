import {ref, computed, watch, onUnmounted} from 'vue';
import ReactiveStore from '@/_reactivestack/store/reactive.store';

export default {
	name: 'Controls',
	emits: ['resend-config'],

	setup(props, context) {
		const reactiveStore = new ReactiveStore('Controls-Store');
		const store = ref(reactiveStore.getStore());
		onUnmounted(() => reactiveStore.destroy());

		let page = ref(1);
		let pageSize = ref(10);
		let search = ref('');
		let pageCount = computed(() => parseInt(store.value.loremsCount / pageSize.value, 10) + 1);

		const emitResendConfig = () =>
			context.emit('resend-config', {
				page: page.value,
				pageSize: pageSize.value,
				search: search.value
			});

		watch(page, () => emitResendConfig());
		watch(pageSize, () => emitResendConfig());
		watch(search, () => emitResendConfig());
		watch(pageCount, () => {
			if (page.value > pageCount.value) {
				page.value = pageCount.value;
				emitResendConfig();
			}
		});

		return {
			MIN_PAGE_SIZE: 5,
			MAX_PAGE_SIZE: 25,
			page,
			pageSize,
			search,
			pageCount,
			emit: emitResendConfig,
			pageDec: () => page.value--,
			pageInc: () => page.value++,
			pageSizeDec: () => pageSize.value--,
			pageSizeInc: () => pageSize.value++,
			resetSearch: () => {
				search.value = '';
			}
		};
	}
};
