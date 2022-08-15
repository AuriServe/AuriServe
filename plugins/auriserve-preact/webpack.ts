import generate from 'webpack-gen';

export default generate({
	noClientPreactAlias: true,
	noServerPreactAlias: true,
	export: {
		server: './Main.ts',
		client: './Main.ts'
	}
});
