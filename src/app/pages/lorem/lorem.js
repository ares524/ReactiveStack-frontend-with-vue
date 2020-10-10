import _ from "lodash";
import moment from "moment";

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

import {loremStore} from "./_store/lorem.store";
import LoremUpdater from "./_store/lorem.updater";

let updater;
const VUE_APP_API_PATH = process.env.VUE_APP_API_PATH;

export default {
	name: "Lorem",
	props: ["loremId"],

	store: loremStore,

	setup() {
		return {
			SPECIES: ["Human", "Draenei", "Dryad", "Dwarf", "Gnome", "Worgde"]
		}
	},

	methods: {
		momentDate(date) {
			return moment(date).format("YYYY/MM/DD HH:mm:ss");
		},
		isDisabled(fieldName) {
			if (this.$store.lorem) {
				let meta = this.$store.lorem.meta;
				if (meta) {
					let field = _.get(meta, fieldName);
					if (field) {
						let user = _.get(field, "user");
						return user !== AuthService.user().id;
					}
				}
			}
			return false;
		},
		onFocus(field) {
			if (this.isDisabled(field)) return;
			fetch(VUE_APP_API_PATH + "/api/lorem/focus/" + this.$store.lorem._id, {
				method: "POST",
				headers: AuthService.getAuthHeader(),
				body: JSON.stringify({field})
			});
		},
		onBlur(field) {
			fetch(VUE_APP_API_PATH + "/api/lorem/blur/" + this.$store.lorem._id, {
				method: "POST",
				headers: AuthService.getAuthHeader(),
				body: JSON.stringify({field})
			});
		},
		onChange: _.throttle(function (e) {
			let {target: {name: field, value}} = e;
			this.$store.setValue(field, value);

			fetch(VUE_APP_API_PATH + "/api/lorem/change/" + this.$store.lorem._id, {
				method: "POST",
				headers: AuthService.getAuthHeader(),
				body: JSON.stringify({value, field})
			});
		}, 250, {"leading": true}),

		async closeDialog() {
			const response = await fetch(VUE_APP_API_PATH + "/api/lorem/cancel/" + this.$store.lorem._id, {
				method: "POST",
				headers: AuthService.getAuthHeader(),
				body: JSON.stringify({})
			});
			const completed = await response.json();
			if (completed) router.push("/");
			else console.error(" - closeDialog response", completed);  	// oops...
		},
		async saveLorem() {
			const response = await fetch(VUE_APP_API_PATH + "/api/lorem/save/", {
				method: "POST",
				headers: AuthService.getAuthHeader(),
				body: JSON.stringify({document: this.$store.lorem})
			});
			const completed = await response.json();
			if (completed) router.push("/");
			else console.error(" - saveLorem response", completed);	// oops...
		}
	},

	computed: {
		isDraft() {
			return this.$store.lorem.isDraft;
		}
	},

	watch: {
		isDraft: function (value) {
			if (value !== true) {
				// TODO: goto homepage...
			}
		}
	},

	async beforeCreate() {
		if (AuthService.loggedIn()) {
			if (updater) updater.destroy();
			updater = new LoremUpdater();
			updater.setConfig({_id: this.$props.loremId});
		}
	},
	beforeRouteLeave(to, from, next) {
		this.$store.reset();
		if (updater) updater.destroy();
		updater = null;
		next();
	}
}
