import _ from 'lodash';
import {createRouter, createWebHistory} from 'vue-router';

import About from './app/pages/about/About.vue';
import Lorem from './app/pages/lorem/Lorem.vue';
import Lorems from './app/pages/lorems/Lorems.vue';

import Logout from './app/pages/logout/Logout.vue';
import Social from './app/pages/login/Social.vue';

import AuthService from './_reactivestack/auth.service';
import ClientSocket from './_reactivestack/client.socket';

const routes = [
	Lorems.route(),
	Lorem.route(),
	{path: '/about', component: About},
	Logout.route(),
	...Social.routes()
];
console.table(routes);

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

// https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes
// https://www.digitalocean.com/community/tutorials/how-to-set-up-vue-js-authentication-and-route-handling-using-vue-router#step-3-%E2%80%94-updating-the-vue-router-file

const _clean = (path) => {
	if (_.startsWith(path, '/')) path = path.substr(1);
	return path;
};

router.beforeEach(function (to, from, next) {
	// console.log("\nrouter.beforeEach", to.path, "loggedIn=" + AuthService.loggedIn());
	ClientSocket.location(_clean(to.path));
	if (to.matched.some((route) => route.meta.requiresAuth)) {
		if (!AuthService.loggedIn()) {
			next({
				path: '/about'
				// , params: {nextUrl: to.fullPath}
			});
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
