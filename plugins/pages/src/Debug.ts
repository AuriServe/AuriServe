import auriserve, { log } from 'auriserve';
import { WebSocket, WebSocketServer } from 'ws';

import { addInjector } from './Injectors';

const sockets: WebSocket[] = [];

export function startDebugSocket() {
	log.info('[Pages] Starting Debug Websocket Server.');
	const wss = new WebSocketServer({ port: 11149 });
	wss.on('connection', (ws) => sockets.push(ws));
	auriserve.once('cleanup', () => wss!.close());

	addInjector('head', () => `<script>
		try {
			const DEBUG_SOCKET_ADDRESS = \`ws://\${location.hostname}:11149\`;
			const socket = new WebSocket(DEBUG_SOCKET_ADDRESS);
			socket.addEventListener('open', () => {
				socket.addEventListener('close', () => window.location.reload());
			});
		}
		catch (e) {
			console.warn(e);
		}
	</script>`);
}

export function reloadClients() {
	sockets.forEach((socket) => socket.close());
	sockets.length = 0;
}
