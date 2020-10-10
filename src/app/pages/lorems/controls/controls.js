import {reactive} from "vue";
import {loremsStore} from "../_store/lorems.store";

export default {
	name: "Controls",
	emits: ["resend-config"],
	data() {
		return {
			MIN_PAGE_SIZE: 5,
			MAX_PAGE_SIZE: 25
		};
	},
	setup() {
		return reactive({
			page: 1,
			pageSize: 10,
			search: ""
		});
	},
	computed: {
		pageCount() {
			return parseInt(loremsStore.loremsTotalCount / this.pageSize, 10) + 1;
		}
	},
	methods: {
		emit() {
			this.$emit("resend-config", {
				page: this.page,
				pageSize: this.pageSize,
				search: this.search
			});
		},
		pageDec() {
			this.page--;
		},
		pageInc() {
			this.page++;
		},
		pageSizeDec() {
			this.pageSize--;
		},
		pageSizeInc() {
			this.pageSize++;
		},
		resetSearch() {
			this.search = "";
		}
	},
	watch: {
		page: function () {
			this.emit();
		},
		pageSize: function () {
			this.emit();
		},
		search: function () {
			this.emit();
		},
		pageCount: function () {
			if (this.page > this.pageCount) {
				this.page = this.pageCount;
				this.emit();
			}
		}
	}
}
