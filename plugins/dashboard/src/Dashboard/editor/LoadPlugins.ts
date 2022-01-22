// import { AdminDefinition } from 'common/definition';

// declare global {
// 	interface Window {
// 		serve?: any;
// 	}
// }

// export type PluginElements = { [key: string]: AdminDefinition | undefined };

// export default async function loadPlugins({
// 	scripts,
// 	styles,
// 	themes,
// }: {
// 	scripts: boolean;
// 	styles: boolean;
// 	themes: boolean;
// }): Promise<PluginElements> {
// 	const { pluginScripts, pluginStyles }: { pluginScripts: string[]; pluginStyles: string[] } = JSON.parse(
// 		(document.getElementById('plugins') as any).innerText
// 	);

// 	const pluginElements: PluginElements = {};

// 	if (scripts) {
// 		window.serve = {
// 			registerElement: (elem: AdminDefinition) => (pluginElements[elem.identifier] = elem),
// 		};

// 		await Promise.all(
// 			pluginScripts.map((s: string) => {
// 				return new Promise<void>((resolve) => {
// 					const script = document.createElement('script');

// 					script.async = true;
// 					script.src = `/plugin/${s}`;
// 					script.addEventListener('load', () => resolve());

// 					document.head.appendChild(script);
// 				});
// 			})
// 		);
// 	}

// 	if (themes) {
// 		// const { themes: siteThemes }: { themes: string[] } =
// 		// 	JSON.parse((document.getElementById('themes') as any).innerText);

// 		// await Promise.all(siteThemes.map((s: string) => {
// 		// 	return new Promise<void>((resolve) => {
// 		// 		const style = document.createElement('link');

// 		// 		style.rel = 'stylesheet';
// 		// 		style.href = '/theme/' + s + '.css';
// 		// 		style.addEventListener('load', () => resolve());

// 		// 		document.head.appendChild(style);
// 		// 	});
// 		// }));

// 		const style = document.createElement('link');

// 		style.rel = 'stylesheet';
// 		style.href = '/styles.css';

// 		document.head.appendChild(style);
// 	}

// 	if (styles) {
// 		await Promise.all(
// 			pluginStyles.map((s: string) => {
// 				return new Promise<void>((resolve) => {
// 					const style = document.createElement('link');

// 					style.rel = 'stylesheet';
// 					style.href = `/plugin/${s}`;
// 					style.addEventListener('load', () => resolve());

// 					document.head.appendChild(style);
// 				});
// 			})
// 		);
// 	}

// 	return pluginElements;
// }
