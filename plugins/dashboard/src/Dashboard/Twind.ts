import {
	twind,
	escape,
	// dom as om,
	cssom as om,
	colorFromTheme,
	css,
	tx,
	defineConfig,
} from 'twind';

import presetTailwind from '@twind/preset-tailwind';

/** The weigths for theme colors. */
const COLOR_WEIGHTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/** The weights for the gray theme colors. */
const COLOR_WEIGHTS_GRAY = [...COLOR_WEIGHTS, 750, 'input'] as const;

/** All of the theme colors in RGB format. */
export const themeColors = {
	'indigo': {
		50: [238, 242, 255],
		100: [224, 231, 255],
		200: [199, 210, 254],
		300: [165, 180, 252],
		400: [129, 140, 248],
		500: [99, 102, 241],
		600: [79, 70, 229],
		700: [67, 56, 202],
		800: [55, 48, 163],
		900: [47, 42, 139],
	},
	'blue': {
		50: [239, 246, 255],
		100: [219, 234, 254],
		200: [191, 219, 254],
		300: [147, 197, 253],
		400: [96, 165, 250],
		500: [59, 130, 246],
		600: [37, 99, 235],
		700: [29, 78, 216],
		800: [30, 64, 175],
		900: [30, 58, 138],
	},
	'cyan': {
		50: [236, 254, 255],
		100: [207, 250, 254],
		200: [165, 243, 252],
		300: [103, 232, 249],
		400: [34, 211, 238],
		500: [6, 182, 212],
		600: [8, 145, 178],
		700: [14, 116, 144],
		800: [21, 94, 117],
		900: [22, 78, 99],
	},
	'emerald': {
		50: [236, 253, 245],
		100: [209, 250, 229],
		200: [167, 243, 208],
		300: [110, 231, 183],
		400: [52, 211, 153],
		500: [16, 185, 129],
		600: [5, 150, 105],
		700: [4, 120, 87],
		800: [6, 95, 70],
		900: [6, 78, 59],
	},
	'lime': {
		50: [247, 254, 231],
		100: [236, 252, 203],
		200: [217, 249, 157],
		300: [190, 242, 100],
		400: [163, 230, 53],
		500: [132, 204, 22],
		600: [101, 163, 13],
		700: [77, 124, 15],
		800: [63, 98, 18],
		900: [54, 83, 20],
	},
	'amber': {
		50: [255, 251, 235],
		100: [254, 243, 199],
		200: [253, 230, 138],
		300: [252, 211, 77],
		400: [251, 191, 36],
		500: [245, 158, 11],
		600: [217, 119, 6],
		700: [180, 83, 9],
		800: [146, 64, 14],
		900: [120, 53, 15],
	},
	'red': {
		50: [254, 242, 242],
		100: [254, 226, 226],
		200: [254, 202, 202],
		300: [252, 165, 165],
		400: [248, 113, 113],
		500: [239, 68, 68],
		600: [220, 38, 38],
		700: [185, 28, 28],
		800: [153, 27, 27],
		900: [127, 29, 29],
	},
	'pink': {
		50: [253, 242, 248],
		100: [252, 231, 243],
		200: [251, 207, 232],
		300: [249, 168, 212],
		400: [244, 114, 182],
		500: [236, 72, 153],
		600: [219, 39, 119],
		700: [190, 24, 93],
		800: [157, 23, 77],
		900: [131, 24, 67],
	},
	'gray-light': {
		50: [248, 250, 252],
		100: [241, 245, 249],
		200: [226, 232, 240],
		300: [203, 213, 225],
		400: [148, 163, 184],
		500: [100, 116, 139],
		600: [71, 85, 105],
		700: [51, 65, 85],
		750: [27, 38, 61],
		800: [30, 41, 59],
		900: [15, 23, 42],
		input: [29, 40, 63],
	},
	'gray-dark': {
		50: [241, 245, 249],
		100: [203, 213, 225],
		200: [148, 163, 184],
		300: [100, 116, 139],
		400: [69, 85, 107],
		500: [55, 71, 94],
		600: [43, 57, 81],
		700: [32, 45, 68],
		750: [27, 38, 61],
		800: [23, 33, 55],
		900: [15, 23, 42],
		input: [29, 40, 63],
	},
};

/** Accepts a color name, and constructs a CSS color from the custom property of that name and an opacityValue. */
function twindColor(color: string) {
	return ({ opacityValue }: { opacityValue?: number }) =>
		`rgba(var(--${color}) / ${opacityValue ?? 1})`;
}

const config = defineConfig({
	presets: [presetTailwind()],
	darkMode: 'class',
	hash: (val: string) => {
		if (val.startsWith('dash-')) return val;
		return `dash-${val}`;
	},
	rules: [
		[
			'icon-p-',
			colorFromTheme({
				section: 'colors',
				property: '--icon-primary' as any,
			}),
		],
		[
			'icon-s-',
			colorFromTheme({
				section: 'colors',
				property: '--icon-secondary' as any,
			}),
		],
		['interact-none', { userSelect: 'none', pointerEvents: 'none' }],
	],
	variants: [
		['focus-input', '&:focus'],
		['focus', '&:focus-visible'],

		['hocus', '&:hover,&:focus-visible'],
		[
			'((group|peer)(~.+)?)-hocus',
			(({ 1: $1 }: { 1: string }, { e, h }: { e: any; h: any }) =>
				['hover', 'focus-visible']
					.map((state) => `:merge(.${e(h($1))}):${state}${$1[0] === 'p' ? '~' : ' '}&`)
					.join(',')) as any,
		],
		[
			'((group|peer)(~.+)?)-focus-input',
			(({ 1: $1 }: { 1: string }, { e, h }: { e: any; h: any }) =>
				`:merge(.${e(h($1))}):focus${$1[0] === 'p' ? '~' : ' '}&`) as any,
		],
		[
			'((group|peer)(~.+)?)-focus',
			(({ 1: $1 }: { 1: string }, { e, h }: { e: any; h: any }) =>
				`:merge(.${e(h($1))}):focus-visible${$1[0] === 'p' ? '~' : ' '}&`) as any,
		],
		// ['peer-focus', (_: any, { h }: any) => `.${escape(h('peer'))}:focus-visible ~ &`],
		[
			'peer-placeholder-shown',
			(_: any, { h }: any) => `.${escape(h('peer'))}:placeholder-shown ~ &`,
		],
		[
			'input-inactive',
			(_: any, { h }: any) =>
				`.${escape(h('peer'))}:is(:placeholder-shown:not(:focus)) ~ &`,
		],
	],
	theme: {
		extend: {
			transitionDelay: {
				0: '0ms',
			},
			fontFamily: {
				sans: ['Roboto', 'sans-serif'],
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
			cursor: {
				'resize-ns': 'ns-resize',
			},
			animation: {
				'drop-fade-in': 'drop-fade-in 150ms ease-out 1 forwards',
				'rise-fade-in': 'rise-fade-in 150ms ease-out 1 forwards',
				'scale-in': 'scale-in 250ms ease-out 1 forwards',
			},
			keyframes: {
				'scale-in': {
					from: { opacity: 0, transform: 'scale(0.9)' },
					to: { transform: 'scale(1)' },
				},
				'drop-fade-in': {
					from: { opacity: 0, transform: 'translateY(-0.25rem)' },
					to: { opacity: 1 },
				},
				'rise-fade-in': {
					from: { opacity: 0, transform: 'translateY(0.25rem)' },
					to: { opacity: 1 },
				},
			},
		},
		colors: {
			white: ({ opacityValue }: { opacityValue?: number }) =>
				`rgba(255 255 255 / ${opacityValue ?? 1})`,
			black: ({ opacityValue }: { opacityValue?: number }) =>
				`rgba(0 0 0 / ${opacityValue ?? 1})`,
			transparent: 'transparent',
			gray: Object.fromEntries(
				COLOR_WEIGHTS_GRAY.map((weight) => [weight, twindColor(`theme-gray-${weight}`)])
			),
			accent: Object.fromEntries(
				COLOR_WEIGHTS.map((weight) => [weight, twindColor(`theme-accent-${weight}`)])
			),
			red: Object.fromEntries(
				COLOR_WEIGHTS.map((weight) => [weight, twindColor(`color-red-${weight}`)])
			),
		} as any,
	},
});

const tw$ = twind(config, om());
export const tw = tx.bind(tw$);

tw(css`
	@font-face {
		font-weight: 100 900;
		font-family: 'Roboto';
		src: url('/dashboard/res/font_roboto.ttf') format('truetype');
	}

	@property --icon-primary {
		syntax: '<color>';
	}

	@property --icon-secondary {
		syntax: '<color>';
	}

	:root {
		${
			// Create CSS variables for all of the colors.
			Object.entries(themeColors)
				.map(([name, colors]) =>
					Object.entries(colors)
						.map(([weight, color]) => `--color-${name}-${weight}: ${color.join(' ')};`)
						.join('\n')
				)
				.join('\n')
		}

		${COLOR_WEIGHTS_GRAY.map(
			(weight) => `--theme-gray-${weight}: var(--color-gray-light-${weight});`
		).join('\n')}
	}

	.dark {
		${COLOR_WEIGHTS_GRAY.map(
			(weight) => `--theme-gray-${weight}: var(--color-gray-dark-${weight});`
		).join('\n')}
	}

	[class*='dash-before']::before {
		display: block;
		--dash-tw-content: ' ';
		content: var(--dash-tw-content);
	}

	[class*='dash-after']::after {
		display: block;
		--dash-tw-content: ' ';
		content: var(--dash-tw-content);
	}

	${Object.keys(themeColors)
		.map(
			(name) => `.theme-${name} {
				${COLOR_WEIGHTS.map(
					(weight) => `--theme-accent-${weight}: var(--color-${name}-${weight});`
				).join('\n')}
			}`
		)
		.join('\n')}

	svg, svg > * {
		transition: all 75ms ease-in-out;
	}

	html.AS_APP {
		overflow-x: hidden;
		overflow-y: scroll;
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
	}

	@media (pointer: fine) {
		html.AS_APP body::-webkit-scrollbar,
		html.AS_APP body *::-webkit-scrollbar {
			@apply w-[14px] h-[14px] bg-gray-900;
		}

		body::-webkit-scrollbar-thumb,
		body *::-webkit-scrollbar-thumb {
			@apply rounded-full bg-gray-600 hover:bg-gray-500 border-solid border-4 border-gray-900;
		}

		html.AS_APP body .scroll-input::-webkit-scrollbar {
			@apply bg-gray-input;
		}

		html.AS_APP body .scroll-input:focus::-webkit-scrollbar {
			@apply bg-gray-700;
		}

		html.AS_APP body .scroll-input::-webkit-scrollbar-thumb {
			@apply bg-gray-500 hover:bg-gray-400 border-solid border-4 border-gray-input;
		}

		html.AS_APP body .scroll-input:focus::-webkit-scrollbar-thumb {
			@apply border-gray-700;
		}
	}

	.AS_TRANSITION_THEME,
	.AS_TRANSITION_THEME *,
	.AS_TRANSITION_THEME *::before,
	.AS_TRANSITION_THEME *::after {
		transition: all 0.25s 0s !important;
	}

	.AS_ROOT {
		@apply font-sans;
	}

	*::selection {
		@apply bg-gray-500/50;
	}

	${
		/* Animations for watching for Autofill events. */
		['Start', 'Cancel']
			.map(
				(type) => `@keyframes onAutoFill${type} {
			from { --v: 1 }
			to { --v: 0 }
		}`
			)
			.join('\n')
	}

	input:autofill {
		animation: onAutoFillStart 0s 1;
	}

	input:not(:autofill) {
		animation: onAutoFillCancel 0s 1;
	}
`);

export { merge } from 'common';
export { css } from 'twind';
