import Cookie from 'js-cookie';
import * as Preact from 'preact';

import Popout from './Popout';

let root: any;

const onLogout = () => {
	Cookie.remove('tkn');
	Preact.render('', document.body, root);
};

root = Preact.render(Preact.h(Popout, { onLogout }), document.body);
