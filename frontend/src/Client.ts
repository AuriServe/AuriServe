import Cookie from 'js-cookie';
import Preact from 'preact';

import Popout from './Popout';

let root: any;

const onLogout = () => {
	Cookie.remove('tkn');
	Preact.render('', document.body, root);
};

const ws = new WebSocket(`ws://${location.host}/admin/watch`);
ws.addEventListener('message', (evt) => {
	if (evt.data === 'refresh') window.location.reload();
});

const container = document.createElement('div');
document.body.appendChild(container);
root = Preact.render(Preact.h(Popout, { onLogout }), container);
