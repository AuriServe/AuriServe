module.exports = {
	parser: "sugarss",
	plugins: [
		require('tailwindcss'),
		require('autoprefixer'),
		require('postcss-nested'),
		require('postcss-nested-vars'),
		require('postcss-extend'),
		require('postcss-import')
	]
}
