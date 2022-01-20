/* eslint-disable */

const plugin = require('tailwindcss/plugin');

const varColor =
	(color) =>
	({ opacityValue }) =>
		`rgba(var(--color-${color}), ${opacityValue ?? 1})`;

const varColorSwatch = (color) => {
	const colors = {};
	[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(
		(weight) => (colors[weight] = varColor(`${color}-${weight}`))
	);
	return colors;
};

module.exports = {
	content: ['./src/**/*.pcss'],
	darkMode: 'class',
	// corePlugins: {
	// 	preflight: false,
	// },
	theme: {
		extend: {
			outline: {
				solid: 'solid',
			},
			transitionDelay: {
				0: '0ms',
			},
			height: {
				min: 'min-content',
				max: 'max-content',
			},
			maxHeight: {
				128: '32rem',
			},
			spacing: {
				18: '4.5rem',
			},
		},
		fontFamily: {
			// body: 'var(--theme-font-body)',
			// head: 'var(--theme-font-head',
			header: 'var(--font-header)',
			body: ['Catamaran'],
		},
		colors: {
			white: 'white',
			black: 'black',
			transparent: 'transparent',
			primary: varColorSwatch('primary'),
			secondary: varColorSwatch('secondary'),
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				'.interact-none': {
					userSelect: 'none',
					pointerEvents: 'none',
				},
				'.interact-auto': {
					userSelect: 'auto',
					pointerEvents: 'auto',
				},
			});
		}),

		plugin(({ addUtilities }) => {
			addUtilities({
				'.text-shadow-sm': { textShadow: '0 2px 4px rgba(0, 0, 0, 0.10)' },
				'.text-shadow-md': {
					textShadow: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
				},
				'.text-shadow-lg': {
					textShadow: '0 15px 30px rgba(0, 0, 0, 0.11), 0 5px 15px rgba(0, 0, 0, 0.08)',
				},
				'.text-shadow-none': { textShadow: 'none' },
			});
		}),

		plugin(({ addVariant }) => {
			addVariant('old-focus', '&:focus');
			addVariant('peer-old-focus', ':merge(.peer):focus ~ &');
			addVariant('group-old-focus', ':merge(.group):focus &');

			addVariant('focus', '&:focus-visible');
			addVariant('peer-focus', ':merge(.peer):focus-visible ~ &');
			addVariant('group-focus', ':merge(.group):focus-visible &');

			addVariant('focus-visible', 'DO NOT USE');
			addVariant('peer-focus-visible', 'DO NOT USE');
			addVariant('group-focus-visible', 'DO NOT USE');

			addVariant('hocus', ['&:hover', '&:focus-visible']);
			addVariant('peer-hocus', [
				':merge(.peer):hover ~ &',
				':merge(.peer):focus-visible ~ &',
			]);
			addVariant('group-hocus', [
				':merge(.group):hover &',
				':merge(.group):focus-visible &',
			]);

			addVariant('group-active', ':merge(.group):active &');
			addVariant('active', '&:active');
		}),
	],
};
