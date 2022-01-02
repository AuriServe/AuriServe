module.exports = {
	parser: "sugarss",
	plugins: [
		require('postcss-nested'),
		require('postcss-nested-vars'),
		require('postcss-simple-extend'),
		require('postcss-import'),
		require('autoprefixer')
	]
}
