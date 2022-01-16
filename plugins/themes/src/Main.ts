import path from 'path';

import ThemeManager from './ThemeManager';

// const theme = {
// 	color: {
// 		primary: {
// 			50: '#FFE3E3',
// 			100: '#FFBDBD',
// 			200: '#FF9B9B',
// 			300: '#F86A6A',
// 			400: '#EF4E4E',
// 			500: '#dc2e2e',
// 			600: '#ca1e24',
// 			700: '#ad1a20',
// 			800: '#8A041A',
// 			900: '#610316',
// 		},
// 		secondary: {
// 			50: '#faf9f7',
// 			100: '#E6E3E1',
// 			200: '#D3CEC4',
// 			300: '#B8B2A7',
// 			400: '#A39E93',
// 			500: '#8a7c79',
// 			600: '#6f6361',
// 			700: '#564e50',
// 			800: '#393536',
// 			900: '#2d2a28',
// 		},
// 	},
// 	font: {
// 		body: 'sans-serif',
// 		header: 'serif',
// 	},
// };

(async () => {
	const themePath = path.join(__dirname, '../../../site-data/edsraku/themes');
	const themes = new ThemeManager(themePath);
	await themes.init();
	// await themes.setEnabled([ 'test_theme' ]);

	// console.log(await fs.readFile(path.join(themePath, 'test_theme/theme.css'), 'utf8'));

	// const manifest = YAML.parse(
	// 	await fs.readFile(path.join(themePath, 'manifest.yaml'), 'utf8')
	// );
	// console.log(manifest);

	// directives.forEach(([regex, replacer]) => (theme = theme.replace(regex, replacer)));

	// console.log(theme);
})();
