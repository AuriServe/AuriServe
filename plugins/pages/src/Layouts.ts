export const registeredLayouts = new Map();

export function registerLayout(identifier: string, layout: string): void {
	registeredLayouts.set(identifier, layout);
}

export function unregisterLayout(identifier: string): boolean {
	return registeredLayouts.delete(identifier);
}

registerLayout(
	'default',
`
<input type='checkbox' id='navigation_toggle' style='display: none;'/>
<header id='header' data-include='header'></header>
<main id='main' data-include='main'></main>
<footer id='footer' data-include='footer'></footer>
`
);
