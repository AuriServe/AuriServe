import { h } from 'preact';
import { Icon, registerSettings } from 'dashboard';

function SocialAccounts() {
	return h('p', {}, 'SOcial accounts');
}

registerSettings({
	identifier: 'social-media:accounts',
	title: 'Social Accounts',
	path: 'social',
	icon: Icon.users,
	component: SocialAccounts,
});
