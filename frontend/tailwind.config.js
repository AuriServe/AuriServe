/* eslint-disable */

const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

const varColor =
	(color) =>
	({ opacityValue }) =>
		`rgba(var(--theme-${color}), ${opacityValue ?? 1})`;

const varColorSwatch = (color) => {
	const colors = {};
	[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(
		(weight) => (colors[weight] = varColor(`${color}-${weight}`))
	);
	return colors;
};

module.exports = {
	content: ['./src/**/*.sss', './src/**/*.tsx', './src/**/*.tw'],
	darkMode: 'class',
	corePlugins: {
		preflight: false,
	},
	theme: {
		extend: {
			transitionDelay: {
				0: '0ms',
			},
			fontFamily: {
				sans: ['Roboto', ...defaultTheme.fontFamily.sans],
			},
			height: {
				min: 'min-content',
				max: 'max-content',
			},
			maxHeight: {
				128: '32rem',
			},
			fontWeight: {
				...defaultTheme.fontWeight,
				normal: 450,
			},
			spacing: {
				18: '4.5rem',
			},
			cursor: {
				'resize-ns': 'ns-resize',
			},
		},
		colors: {
			transparent: 'transparent',
			neutral: {
				...varColorSwatch('neutral'),
				750: varColor('neutral-750'),
				input: varColor('neutral-input'),
			},
			gray: {
				...varColorSwatch('gray'),
				750: varColor('gray-750'),
				input: varColor('gray-input'),
			},
			accent: varColorSwatch('accent'),
			blue: varColorSwatch('accent'),
			indigo: varColorSwatch('accent'),
			white: varColor('neutral-0'),
			black: varColor('neutral-950'),
			red: colors.rose,
			// transparent: 'transparent',
			// current: 'currentColor',
			// white: colors.white,
			// black: colors.black,
			// gray: {
			// 	50:  '#171D23',
			// 	100: '#1d2731',
			// 	200: '#212f3c',
			// 	300: '#303D4C',
			// 	400: '#596A7D',
			// 	500: '#74879D',
			// 	600: '#879CB3',
			// 	700: '#AABCCF',
			// 	800: '#D0DDEB',
			// 	900: '#EAF0F6'
			// },
			// blue: colors.blue,
			// indigo: colors.indigo
		},
		animation: {
			'rocket': 'rocket 0.5s 1',
			'fadein-500': 'fadein 500ms 1',
			'fadein-150': 'fadein 150ms 1',
			'select': 'select 150ms 1',
			'spinner-1': 'spinner 1s ease-in-out alternate infinite',
			'spinner-2': 'spinner 1s ease-in-out -1s alternate infinite',
		},
		keyframes: {
			rocket: {
				from: {
					opacity: 0,
					transform: 'scale(0.75) translate(-20px, 20px)',
				},
				to: {
					opacity: 1,
					transform: 'scale(1)',
				},
			},
			fadein: {
				from: {
					opacity: 0,
				},
				to: {
					opacity: 1,
				},
			},
			select: {
				from: {
					opacity: 0,
					transform: 'scale(1.05)',
				},
				to: {
					opacity: 1,
				},
			},
			spinner: {
				from: {
					transform: 'scale(0)',
				},
				to: {
					transform: 'scale(1)',
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/line-clamp'),

		/**
		 * Registers text shadow utilities.
		 */

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

		/**
		 * Register interact-auto / interact-none shorthands which set both `pointer-events` and `user-select`.
		 */

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

		/**
		 * Register icon-p-* and icon-s-* classes for the Svg component.
		 */

		plugin(({ theme, matchUtilities }) => {
			const rawColors = theme('colors');
			const colors = {};

			function addColors(raw, pre = '') {
				for (let [k, v] of Object.entries(raw)) {
					if (typeof v === 'string') colors[pre + k] = v;
					else if (typeof v === 'function') colors[pre + k] = v({ opacityValue: 1 });
					else if (typeof v === 'object') addColors(v, `${pre + k}-`);
				}
			}

			addColors(rawColors);

			matchUtilities(
				{
					'icon-p': (value) => ({ '--icon-primary': value }),
					'icon-s': (value) => ({ '--icon-secondary': value }),
				},
				{ values: colors }
			);
		}),

		/**
		 * Variant tweaks to keep me sane.
		 * Sets the 'focus' variant to use :focus-visible, removes the 'focus-visible' variant,
		 * creates a 'focus-old' variant that uses regular :focus,
		 * and adds a 'hocus' variant that matches on both :hover and :focus-visible.
		 */

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

			addVariant('not-hocus', '&:not(:hover):not(:focus-visible)');
			addVariant('peer-not-hocus', ':merge(.peer):not(:hover):not(:focus-visible) ~ &');
			addVariant('group-not-hocus', ':merge(.group):not(:hover):not(:focus-visible) &');

			addVariant('not-autofill', '&:not(:autofill)');
			addVariant('group-active', ':merge(.group):active &');
			addVariant('active', '&:active');
		}),

		/**
		 * Extra groups and peers plugin.
		 * Adds more groups and peers so that you can nest selectors.
		 * By default, registers `group-a` through `group-e`, with the variants
		 * `hover`, `focus`, `focus-visible`, `focus-within`, and `active`.
		 * Can be configured with the following options:
		 *
		 * - labels: An array of labels to use for group and peer names. Default: ['a', 'b', 'c', 'd', 'e'].
		 * - groupLabels: An array of labels to use only for groups. Default: `labels`.
		 * - peerLabels: An array of labels to use only for peers. Default: `labels`.
		 * - variants: Additional variant -> variant rule pairs to generate for groups and peers.
		 * - groupVariants: Additional variant -> variant rule pairs to generate for groups. Default: `variants`.
		 * - peerVariants: Additional variant -> variant rule pairs to generate for peers. Default: `variants`.
		 */

		plugin.withOptions((options = {}) => {
			const groupLabels = options.groupLabels ??
				options.labels ?? ['a', 'b', 'c', 'd', 'e'];
			const peerLabels = options.peerLabels ??
				options.labels ?? ['a', 'b', 'c', 'd', 'e'];

			const defaultVariants = {
				'hover': '&:hover',
				'focus': '&:focus',
				'focus-visible': '&:focus-visible',
				'focus-within': '&:focus-within',
				'active': '&:active',
			};

			const groupVariants = {
				...defaultVariants,
				...(options.groupVariants ?? options.variants ?? {}),
			};
			const peerVariants = {
				...defaultVariants,
				...(options.peerVariants ?? options.variants ?? {}),
			};

			return function ({ addVariant, addComponents }) {
				for (const group of groupLabels) {
					addComponents({ [`.group-${group}`]: {} });
					for (let [name, rule] of Object.entries(groupVariants)) {
						if (rule === undefined) continue;
						rule =
							typeof rule === 'string'
								? `${rule.replace('&', `.group-${group}`)} &`
								: rule.map((rule) => `${rule.replace('&', `.group-${group}`)} &`);
						addVariant(`group-${group}-${name}`, rule);
					}
				}

				for (const peer of peerLabels) {
					addComponents({ [`.peer-${peer}`]: {} });
					for (let [name, rule] of Object.entries(peerVariants)) {
						if (rule === undefined) continue;
						rule =
							typeof rule === 'string'
								? `${rule.replace('&', `.peer-${peer}`)} ~ &`
								: rule.map((rule) => `${rule.replace('&', `.peer-${peer}`)} ~ &`);
						addVariant(`peer-${peer}-${name}`, rule);
					}
				}
			};
		})({
			variants: {
				'hocus': ['&:hover', '&:focus-visible'],
				'focus': '&:focus-visible',
				'focus-visible': undefined,
				'focus-old': '&:focus',
			},
		}),
	],
};
