import generate from 'webpack-gen';

export default generate({
	postcss: true,
	exportConfigs: {
		server: './Server.ts',
		client: './Client.ts'
	}
});
