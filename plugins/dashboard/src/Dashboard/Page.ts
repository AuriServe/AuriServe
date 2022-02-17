import { assert } from 'common';
import { FunctionalComponent } from 'preact';

import { HomePage, SettingsPage } from './Component/Page';

export const pages: Map<string, Page> = new Map();

export interface Page {
	identifier: string;
	title: string;
	path: string;
	component: FunctionalComponent<any>;
}

export function registerPage(page: Page) {
	assert(
		!pages.has(page.identifier),
		`Page ${page.identifier} has already been registered.`
	);
	pages.set(page.identifier, page);
}

export function unregisterPage(identifier: string): boolean {
	return pages.delete(identifier);
}

export function getPages(): Map<string, Page> {
	return pages;
}

registerPage({
	identifier: 'dashboard:home',
	title: 'Home',
	path: '/',
	component: HomePage,
});

registerPage({
	identifier: 'dashboard:settings',
	title: 'Settings',
	path: '/settings',
	component: SettingsPage,
});
