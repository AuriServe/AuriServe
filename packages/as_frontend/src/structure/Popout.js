"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("preact/hooks");
require("./Popout.sass");
function Popout(props) {
    const [visible, setVisible] = hooks_1.useState(false);
    const editUrl = '/admin/pages/' + window.location.pathname.substr(1) + (window.location.pathname.endsWith('/') ? 'index' : '');
    const settingsUrl = '/admin/settings/overview';
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            setVisible(false);
            setTimeout(props.onLogout, 80);
        }
    };
    return (<div class={('Popout ' + (visible ? 'Visible' : '')).trim()}>
			<button class='Popout-Button' onClick={() => setVisible(v => !v)}>
				<img class='Popout-Icon' src='/admin/asset/icon/serve-light.svg' alt='AuriServe Menu'/>
			</button>
			<div class='Popout-Inner'>
				<button class='Popout-IconButton Logout' onClick={handleLogout}>
					<img src='/admin/asset/icon/logout-dark.svg' alt='Logout'/></button>
				
				<a class='Popout-IconButton' href={settingsUrl}>
					<img src='/admin/asset/icon/settings-dark.svg' alt='Site Settings'/></a>
				<a class='Popout-IconButton'>
					<img src='/admin/asset/icon/stats-dark.svg' alt='Page Performance'/></a>
				<a class='Popout-IconButton' href={editUrl}>
					<img src='/admin/asset/icon/edit-dark.svg' alt='Edit Page'/></a>
			</div>
		</div>);
}
exports.default = Popout;
