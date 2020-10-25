import {ref, computed, watch, onMounted, onUnmounted} from "vue";

import _ from "lodash";
import moment from "moment";

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";
import LocalStore from "@/_reactivestack/store/local.store";
import StoreTargets from "@/_reactivestack/store/store.targets";
import {sendGet, sendPost} from "@/_reactivestack/_f.send.fetch";

export default {
	name: "Lorem",
	props: ["draftId"],

	setup(props) {
		const storeTargets = new StoreTargets();
		storeTargets.addTarget('draft', 'drafts', {});

		LocalStore
			.init(storeTargets)
			.then(() => {
				if (AuthService.loggedIn()) {
					LocalStore.sendSubscribe('draft', {_id: props.draftId});
				}
			});
		const store = ref(LocalStore.getStore());

		onMounted(() => console.log('lorem onMounted'));
		onUnmounted(() => console.log('lorem onUnmounted'));

		const isDisabled = (fieldName) => {
			if (store.value.draft) {
				let meta = store.value.draft.meta;
				if (meta) {
					let field = _.get(meta, fieldName);
					if (field) {
						let user = _.get(field, "user");
						return user !== AuthService.userId();
					}
				}
			}
			return false;
		};

		const isDraft = computed(() => !_.isEmpty(store.value.draft));

		watch(isDraft, async (value) => {
			if (value !== true) await router.push("/");
		});

		return {
			store,

			notLoaded: () => !_.get(store.value, 'draft.document', false),

			SPECIES: ["Human", "Draenei", "Dryad", "Dwarf", "Gnome", "Worgde"],

			isDraft, isDisabled,

			momentDate: (date) => moment(date).format("YYYY/MM/DD HH:mm:ss"),

			onFocus: (field) => {
				if (isDisabled(field)) return;
				sendPost("/api/draft/focus/" + store.value.draft._id, {field});
			},

			onBlur: (field) => {
				sendPost("/api/draft/blur/" + store.value.draft._id, {field});
			},

			onChange: _.throttle(function (e) {
				let {target: {name: field, value}} = e;
				store.value.setValue(field, value);
				sendPost("/api/draft/change/" + store.value.draft._id, {value, field});
			}, 250, {"leading": true}),

			closeDialog: async () => {
				await sendGet("/api/draft/cancel/" + store.value.draft._id);
				// TODO: remove this and observe the data change!
				router.push("/");
			},

			saveLorem: async () => {
				await sendGet("/api/draft/save/" + store.value.draft._id);
				// TODO: remove this and observe the data change!
				router.push("/");
			},
		}
	}
}
