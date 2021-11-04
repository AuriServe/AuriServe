const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const { transform } = require('typescript');

module.exports = {
	mode: 'jit',
	purge: [
		'./src/**/*.sss',
		'./src/**/*.tsx',
		'./src/**/*.tw'
	],
	darkMode: 'class',
	corePlugins: {
		preflight: false
	},
	theme: {
		extend: {
			transitionDelay: {
				'0': '0ms'
			},
			fontFamily: {
				sans: [ 'Roboto', ...defaultTheme.fontFamily.sans ]
			},
			height: {
				min: 'min-content',
				max: 'max-content'
			},
			maxHeight: {
				'128': '32rem'
			}
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			white: colors.white,
			black: colors.black,
			gray: {
				50:  '#171D23',
				100: '#1d2731',
				200: '#212f3c',
				300: '#303D4C',
				400: '#596A7D',
				500: '#74879D',
				600: '#879CB3',
				700: '#AABCCF',
				800: '#D0DDEB',
				900: '#EAF0F6'
			},
			blue: colors.blue,
			indigo: colors.indigo
		},
		animation: {
			rocket: 'rocket 0.5s 1',
			'fadein-500': 'fadein 500ms 1',
			'fadein-150': 'fadein 150ms 1',
			'select': 'select 150ms 1',
			'spinner-1': 'spinner 1s ease-in-out alternate infinite',
			'spinner-2': 'spinner 1s ease-in-out -1s alternate infinite'
		},
		keyframes: {
			rocket: {
				from: {
					opacity: 0,
					transform: 'scale(0.75) translate(-20px, 20px)'
				},
				to: {
					opacity: 1,
					transform: 'scale(1)'
				}
			},
			fadein: {
				from: {
					opacity: 0
				},
				to: {
					opacity: 1
				}
			},
			select: {
				from: {
					opacity: 0,
					transform: 'scale(1.05)'
				},
				to: {
					opacity: 1
				}
			},
			spinner: {
				from: {
					transform: 'scale(0)'
				},
				to: {
					transform: 'scale(1)'
				}
			}
		}
	},
	plugins: [
		require('tailwindcss-interaction-variants'),
		require('@tailwindcss/aspect-ratio')
	],
}
