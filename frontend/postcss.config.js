module.exports = {
	parser: "sugarss",
	plugins: [
		require('postcss-import'),
		require('tailwindcss/nesting'),
		require('tailwindcss'),
		require('postcss-nested-vars'),
		require('autoprefixer')
	]
}
