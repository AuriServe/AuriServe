import generate from 'webpack-gen';

export default generate({
	noClientPreactAlias: true,
	noServerPreactAlias: true,
	exportConfigs: {
		server: './Main.ts',
		client: './Main.ts'
	}
});
