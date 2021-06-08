const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	mode: 'jit',
	purge: [
		'./src/**/*.sss',
		'./src/**/*.tsx'
	],
	darkMode: 'class',
	theme: {
		extend: {
			transitionDelay: {
				'0': '0ms'
			},
			fontFamily: {
				sans: [ 'Roboto', ...defaultTheme.fontFamily.sans ]
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
			fadein: 'fadein 0.5s 1'
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
			}
		}
	},
	variants: {
		extend: {
			// opacity: [ 'focus-visible', 'group-focus-visible' ],
			// backgroundColor: [ 'focus-visible', 'active' ],
			// filter: [ 'dark' ],
			// invert: [ 'dark' ],
			// hueRotate: [ 'dark' ],
			// brightness: [ 'dark' ],
			// contrast: [ 'dark' ],
			// translate: [ 'group-hover', 'group-focus-visible' ],
			// scale: [ 'group-hover', 'focus-visible', 'group-focus-visible' ],
			// borderColor: [ 'focus-visible', 'active' ],
			// transitionDelay: [ 'group-hover', 'group-focus-visible' ],
		},
	},
	plugins: [
		require('tailwindcss-interaction-variants'),
		require('nightwind')
	],
}
