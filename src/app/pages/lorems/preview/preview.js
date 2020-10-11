import moment from "moment";

import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

import Versions from "./versions/Versions.vue";
import {loremsStore} from "../_store/lorems.store";

const VUE_APP_API_PATH = process.env.VUE_APP_API_PATH;

export default {
	name: "Preview",
	components: {
		Versions
	},
	store: loremsStore,
	methods: {
		momentDate(date) {
			return moment(date).format("YYYY/MM/DD HH:mm:ss");
		},
		async editLorem() {
			const response = await fetch(VUE_APP_API_PATH + "/api/draft/create/lorems/" + this.$store.selectedLorem._id, {
				method: "GET",
				headers: AuthService.getAuthHeader()
			});
			const draftId = await response.json();
			router.push("/lorem/" + draftId);
		}
	}
}
