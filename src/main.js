import {createApp} from "vue";
import Vuex from "vuex";
import SemanticUIVue from "semantic-ui-vue";

import router from "./router";
import App from "./app/App.vue";

createApp(App)
	.use(router)
	.use(Vuex)
	.use(SemanticUIVue)
	.mount("#vue-app");
