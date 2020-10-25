import router from '@/router';
import AuthService from '@/_reactivestack/auth.service';

export default {
	name: 'Logout',
	// beforeCreate() {console.log("Logout beforeCreate")},
	// created() {console.log("Logout created")},
	// beforeMount() {console.log("Logout beforeMount")},
	beforeCreate() {
		AuthService.logout();
		setTimeout(() => {
			router.push('/');
		}, 1000);
	}
};
