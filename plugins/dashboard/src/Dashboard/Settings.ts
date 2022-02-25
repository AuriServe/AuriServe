import { assert } from 'common';
import { FunctionalComponent } from 'preact';

export const settings: Map<string, Settings> = new Map();

export interface Settings {
	identifier: string;
	title: string;
	path: string;
	icon: string;
	component: FunctionalComponent<any>;
}

export function registerSettings(s: Settings) {
	assert(
		!settings.has(s.identifier),
		`Page ${s.identifier} has already been registered.`
	);
	settings.set(s.identifier, s);
}

export function unregisterSettings(identifier: string): boolean {
	return settings.delete(identifier);
}

export function getSettings(): Map<string, Settings> {
	return settings;
}
