import {ref, computed, watch, onUnmounted} from "vue";

import _ from "lodash";
import moment from "moment";

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

import {loremStore} from "./_store/lorem.store";
import LoremUpdater from "./_store/lorem.updater";
import {sendFetchGet, sendFetchPost} from "@/_reactivestack/_f.send.fetch";

let updater;

export default {
	name: "Lorem",
	props: ["draftId"],

	setup(props) {
		let store = ref(loremStore);

		if (AuthService.loggedIn()) {
			if (updater) updater.destroy();
			updater = new LoremUpdater();
			updater.setConfig({_id: props.draftId});
		}

		onUnmounted(() => {
			store.value.reset();
			if (updater) updater.destroy();
			updater = null;
		});

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

			SPECIES: ["Human", "Draenei", "Dryad", "Dwarf", "Gnome", "Worgde"],

			isDraft, isDisabled,

			momentDate: (date) => moment(date).format("YYYY/MM/DD HH:mm:ss"),

			onFocus: (field) => {
				if (isDisabled(field)) return;
				sendFetchPost("/api/draft/focus/" + store.value.draft._id, {field});
			},

			onBlur: (field) => {
				sendFetchPost("/api/draft/blur/" + store.value.draft._id, {field});
			},

			onChange: _.throttle(function (e) {
				let {target: {name: field, value}} = e;
				store.value.setValue(field, value);
				sendFetchPost("/api/draft/change/" + store.value.draft._id, {value, field});
			}, 250, {"leading": true}),

			closeDialog: async () => {
				await sendFetchGet("/api/draft/cancel/" + store.value.draft._id);
				// TODO: remove this and observe the data change!
				router.push("/");
			},

			saveLorem: async () => {
				await sendFetchGet("/api/draft/save/" + store.value.draft._id);
				// TODO: remove this and observe the data change!
				router.push("/");
			},
		}
	}
}
