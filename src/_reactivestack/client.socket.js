import _ from 'lodash';
import {Subject} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import ReconnectingWebSocket from 'reconnecting-websocket';

import AuthService from './auth.service';

const WS_URI = 'ws:' + process.env.VUE_APP_API_PATH + '/ws';

const _path = () => {
	let path = _.trim(_.get(window, 'location.pathname', ''));
	if (_.startsWith(path, '/')) path = path.substr(1);
	return path;
};

export default class ClientSocket extends Subject {
	static _instance;
	static _socket;

	static _queue = [];

	static _onError = (err) => console.error(`[error] ${err.message}`);

	static _onClose = (e) => {
		if (e.wasClean) console.log(`[WS] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
		else console.log('[WS] Connection crashed.');
	};

	static _onOpen = async (e) => {
		console.log('[WS] Connection open.');
		ClientSocket._socket = e.target;
		await ClientSocket.location(_path());

		_.each(ClientSocket._queue, ClientSocket.send);
		ClientSocket._queue = [];
	};

	static _onMessage = async (e) => {
		let {data: message} = e;
		message = JSON.parse(message);
		// console.log("[WS] Message received from server:", ClientSocket._socket.id, _.omit(message, "payload"), AuthService.loggedIn());
		console.log(
			'[WS] Server message:',
			AuthService.loggedIn(),
			ClientSocket._socket.id,
			message.type,
			message.target,
			message.payload
		);

		let {payload} = message;
		switch (message.type) {
			case 'socketId':
				ClientSocket._socket.id = message.socketId;
				await ClientSocket.authenticate();
				return;

			case 'refresh':
				AuthService.refresh(payload);
				return;

			case 'update':
				if (!AuthService.loggedIn()) return;
				ClientSocket._instance.next(message);
				return;

			default:
				return;
		}
	};

	static _connect = () => {
		console.log('[WS] Connecting...');
		ClientSocket._socket = new ReconnectingWebSocket(WS_URI);

		ClientSocket._socket.onopen = ClientSocket._onOpen;
		ClientSocket._socket.onclose = ClientSocket._onClose;
		ClientSocket._socket.onerror = ClientSocket._onError;
		ClientSocket._socket.onmessage = ClientSocket._onMessage;
	};

	static init() {
		if (!ClientSocket._instance) {
			ClientSocket._instance = new ClientSocket();
			ClientSocket._connect();
		}
		return ClientSocket._instance;
	}

	static async authenticate() {
		if (!AuthService.loggedIn()) return;
		await ClientSocket.send({type: 'authenticate', jwt: AuthService.jwt()});
	}

	static updateSubscription(message) {
		ClientSocket.send({
			...message,
			type: 'subscribe'
		});
	}

	static closeSubscription(message) {
		ClientSocket.send({
			...message,
			type: 'unsubscribe'
		});
	}

	static send(message) {
		if (!message.id) message.id = uuidv4();
		if (!ClientSocket._socket || ClientSocket._socket.readyState !== WebSocket.OPEN) {
			ClientSocket._queue.push(message);
			return;
		}

		message = _.isString(message) ? message : JSON.stringify(message);
		return ClientSocket._socket.send(message);
	}

	static async location(path) {
		if (!ClientSocket._instance) {
			ClientSocket._instance = new ClientSocket();
			await ClientSocket._connect();
		}

		ClientSocket.send({
			type: 'location',
			path: path
		});
	}
}
