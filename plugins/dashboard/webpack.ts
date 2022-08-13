import generate from 'webpack-gen';

export default generate({
	noDashboardPreactAlias: true,
	exportConfigs: {
		server: true,
		dashboard: true
	}
});
