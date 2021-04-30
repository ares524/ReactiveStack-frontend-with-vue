import {reactive} from "vue";
import _ from 'lodash';

import ClientSocket from '@/_reactivestack/client.socket';

const DEFAULT_USER_INFO = {user: {}, jwt: ''};

const _getLocalStorageUserInfo = () => {
	let userInfo = localStorage.getItem('userInfo');
	return userInfo ? JSON.parse(userInfo) : DEFAULT_USER_INFO;
};

class AuthService {
	_data;

	constructor() {
		this._data = reactive({});
		this._checkLocalStorage();
	}

	getAuthHeader() {
		return {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + _getLocalStorageUserInfo().jwt,
			FusionPage: _.trim(_.get(window, 'location.pathname', '/'))
		};
	}

	refresh({user, jwt}) {
		console.log('[Auth] refresh:', {user, jwt});
		if (!!user && !!jwt) {
			localStorage.setItem('userInfo', JSON.stringify({user, jwt}));
			this._setData({user, jwt});
		} else {
			// TODO: error?
		}
	}

	login(user, jwt) {
		console.log('[Auth] auth:', {user, jwt});
		if (!!user && !!jwt) {
			localStorage.setItem('userInfo', JSON.stringify({user, jwt}));
			this._setData({user, jwt});
			ClientSocket.authenticate();
		} else {
			this.logout();
		}
	}

	logout() {
		console.log('[Auth] logout.');
		localStorage.removeItem('userInfo');
		this._setData(DEFAULT_USER_INFO);
	}

	data() {
		return this._data;
	}

	jwt() {
		return _.get(this._data, 'jwt');
	}

	user() {
		return _.get(this._data, 'user');
	}

	userAttribute(name) {
		return _.get(this._data, `user.${name}`);
	}

	loggedIn() {
		return !_.isEmpty(this.user());
	}

	_setData(data) {
		let {user, jwt} = data;
		_.set(this._data, 'user', user);
		_.set(this._data, 'jwt', jwt);
	}

	_checkLocalStorage() {
		let userInfo = _getLocalStorageUserInfo();
		if (!!userInfo?.user?.expires_at) {
			const expiresAt = userInfo.user.expires_at;
			const now = new Date().getTime();
			if (now < expiresAt) return this._setData(userInfo);
		}
		this.logout();
	}
}

export default new AuthService();
