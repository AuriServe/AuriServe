import { Location } from 'react-router-dom';

import { togglePalette } from './Component/ShortcutPalette';

import * as Icon from './Icon';

export interface ShortcutContext {
	location: Location;
	navigate(path: string, options?: { replace?: boolean }): void;
}

export interface Shortcut {
	identifier: string;
	title: string;
	description?: string;
	aliases?: string[];
	icon?: string;

	action: (ctx: ShortcutContext) => void;
}

export const registeredShortcuts: Map<string, Shortcut> = new Map();

export function getShortcuts(): Map<string, Shortcut> {
	return registeredShortcuts;
}

export function getShortcut(identifier: string): Shortcut | undefined {
	return registeredShortcuts.get(identifier);
}

export function registerShortcut(shortcut: Shortcut) {
	registeredShortcuts.set(shortcut.identifier, shortcut);
}

export function unregisterShortcut(identifier: string): boolean {
	return registeredShortcuts.delete(identifier);
}

export function getFuzzySearchScore(val: string, query: string) {
	let score = 0;
	let lastPos = -1;
	const maxScore = 10 * Math.max(val.length, query.length);

	for (let i = 0; i < query.length; i++) {
		const pos = val.indexOf(query[i], lastPos + 1);
		if (pos === -1) break;
		if (score === maxScore) break;

		score += Math.max(10 - (pos - lastPos), 0);
		lastPos = pos;
	}

	return score / maxScore;
}

export function fuzzySearch<T extends Record<string, any>>(
	query: string,
	items: T[],
	keys: (keyof T)[],
	minFactor = 0.6): T[] {

	return [...items.values()]
		.map((s) => {
			const score = Math.max(
				...keys.flatMap(k => {
					let values = (s[k] ?? []) as string | string[];
					if (!Array.isArray(values)) values = [ values ];
					return values.map((v: string) => getFuzzySearchScore(v.toLowerCase(), query));
				})
			);
			return [s, score] as [T, number];
		})
		.filter(([, score]) => score > minFactor)
		.sort(([, a], [, b]) => b - a)
		.map(([s]) => s);
}
export function searchShortcuts(query: string): Shortcut[] {
	return fuzzySearch(query, [ ...registeredShortcuts.values() ], [ 'title', 'description', 'aliases' ]).slice(0, 7);
}

registerShortcut({
	identifier: 'dashboard:page_home',
	title: 'Go Home',
	aliases: ['view home', 'main'],
	description: 'Go to the AuriServe home.',
	icon: Icon.home,
	action: ({ navigate }) => navigate('/'),
});

registerShortcut({
	identifier: 'dashboard:page_settings',
	title: 'Settings',
	aliases: [
		'go settings',
		'view settings',
		'view options',
		'view configuation',
		'options',
		'configuration',
	],
	description: 'Manage AuriServe settings.',
	icon: Icon.options,
	action: ({ navigate }) => navigate('/settings/'),
});

// registerShortcut({
// 	identifier: 'dashboard:manage_overview',
// 	title: 'Manage Overview',
// 	aliases: [
// 		'overview settings',
// 		'site name',
// 		'name',
// 		'description',
// 		'favicon',
// 		'address',
// 	],
// 	description: 'Edit basic site appearance settings.',
// 	icon: Icon.home,
// 	action: ({ navigate }) => navigate('/settings/overview/'),
// });

registerShortcut({
	identifier: 'dashboard:shortcut_palette',
	title: 'Shortcut Palette',
	aliases: ['command palette'],
	description: 'Execute commands.',
	icon: Icon.shortcut,
	action: () => {
		togglePalette();
	},
});

registerShortcut({
	identifier: 'dashboard:log_out',
	title: 'Log out',
	aliases: ['exit', 'close'],
	description: 'Log out of AuriServe.',
	icon: Icon.logout,
	action: () => {
		window.localStorage.removeItem('token');
		window.location.href = '/dashboard/';
	},
});

// registerShortcut({
// 	identifier: 'dashboard:toggle_dark_mode',
// 	title: 'Toggle Dark Mode',
// 	aliases: ['dark mode', 'light mode', 'color theme', 'theme'],
// 	description: 'Toggle between light and dark mode.',
// 	icon: Icon.theme,
// 	action: () => {
// 		document.documentElement.classList.add('AS_TRANSITION_THEME');
// 		setTimeout(() => document.documentElement.classList.toggle('dark'), 50);
// 		setTimeout(
// 			() => document.documentElement.classList.remove('AS_TRANSITION_THEME'),
// 			300
// 		);
// 	},
// });
