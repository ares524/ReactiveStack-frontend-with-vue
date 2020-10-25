import _ from "lodash";

import AuthService from "@/_reactivestack/auth.service";

const VUE_APP_API_PATH = process.env.VUE_APP_API_PATH;

const _fixUrl = (url) => {
	if (!_.startsWith(url, VUE_APP_API_PATH)) {
		if (!_.startsWith(url, '/')) url = '/' + url;
		url = VUE_APP_API_PATH + url;
	}
	return url;
};

export const sendGet = async (url) => {
	url = _fixUrl(url);
	const response = await fetch(url, {
		method: "GET",
		headers: AuthService.getAuthHeader()
	});
	return await response.json();
}

export const sendPost = async (url, bodyObject) => {
	url = _fixUrl(url);
	return fetch(url, {
		method: "POST",
		headers: AuthService.getAuthHeader(),
		body: JSON.stringify(bodyObject)
	});
}
