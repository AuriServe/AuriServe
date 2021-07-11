import Cookie from 'js-cookie';
import Preact from 'preact';

import Popout from './Popout';

let root: any;

const onLogout = () => {
	Cookie.remove('tkn');
	Preact.render('', document.body, root);
};

const container = document.createElement('div');
document.body.appendChild(container);
root = Preact.render(Preact.h(Popout, { onLogout }), container);
