import moment from "moment";

import router from "@/router";

import Versions from "./versions/Versions.vue";
import {loremsStore} from "../_store/lorems.store";
import {sendFetchGet} from "@/_reactivestack/_f.send.fetch";

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
			const draftId = await sendFetchGet("/api/draft/create/lorems/" + this.$store.selectedLorem._id);
			router.push("/lorem/" + draftId);
		}
	}
}
