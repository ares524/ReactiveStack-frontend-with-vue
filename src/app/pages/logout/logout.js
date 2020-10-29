import router from '@/router';
import AuthService from '@/_reactivestack/auth.service';

export default {
	name: 'Logout',

	route() {
		return {path: '/logout', component: this};
	},

	beforeCreate() {
		AuthService.logout();
		setTimeout(() => {
			router.push('/');
		}, 1000);
	}
};
