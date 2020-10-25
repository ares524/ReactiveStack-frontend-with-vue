/* eslint-disable no-debugger */
import ClientSocket from '@/_reactivestack/client.socket';

const DEFAULT_USER_INFO = {user: {}, jwt: ''};

const _getLocalStorageUserInfo = () => {
	let userInfo = localStorage.getItem('userInfo');
	return userInfo ? JSON.parse(userInfo) : DEFAULT_USER_INFO;
};

class AuthService {
	_user;
	_jwt;

	constructor() {
		this._user = {};
		this._jwt = '';
		this.checkLocalStorage();
	}

	user() {
		return this._user;
	}

	userId() {
		return this._user.id;
	}

	jwt() {
		return this._jwt;
	}

	loggedIn() {
		return !!this._user.id;
	}

	sendState(state) {
		let {user, jwt} = state;
		this._user = user;
		this._jwt = jwt;
	}

	checkLocalStorage() {
		let userInfo = _getLocalStorageUserInfo();
		if (!!userInfo && !!userInfo.user && !!userInfo.user.expires_at) {
			const expiresAt = userInfo.user.expires_at;
			const now = new Date().getTime();
			if (now < expiresAt) return this.sendState(userInfo);
		}
		this.logout();
	}

	refresh({user, jwt}) {
		console.log('[Auth] refresh:', {user, jwt});
		if (!!user && !!jwt) {
			localStorage.setItem('userInfo', JSON.stringify({user, jwt}));
			this.sendState({user, jwt});
		} else {
			// TODO: error?
		}
	}

	login(user, jwt) {
		console.log('[Auth] login:', {user, jwt});
		if (!!user && !!jwt) {
			localStorage.setItem('userInfo', JSON.stringify({user, jwt}));
			this.sendState({user, jwt});
			ClientSocket.authenticate();
		} else {
			this.logout();
		}
	}

	logout() {
		console.log('[Auth] logout.');
		localStorage.removeItem('userInfo');
		this.sendState(DEFAULT_USER_INFO);
	}

	getAuthHeader() {
		return {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + _getLocalStorageUserInfo().jwt
		};
	}
}

export default new AuthService();
