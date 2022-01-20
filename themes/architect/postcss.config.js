/* eslint-disable */

module.exports = {
	env: 'production',
	plugins: [
		require('autoprefixer'),
		require('postcss-mixins'),
		require('postcss-import'),
		require('tailwindcss/nesting'),
		require('tailwindcss'),
		require('./auriserve-theme'),
	],
};
