import path from 'path';
import generate from 'webpack-gen';

export default generate({
	exportConfigs: {
		server: './server/Main.ts',
		dashboard_no_preact_alias: {
			name: 'dashboard',
			entry: './dashboard/Main.ts',
			output: {
				filename: 'dashboard.js',
				library: {
					name: 'Dashboard',
					type: 'var',
				},
			},

			resolve: {
				alias: {
					'@res': path.join(__dirname, 'res/dashboard'),
					'react': 'preact/compat',
					'react-dom': 'preact/compat',
				},
			},

			module: {
				rules: [
					{
						test: /\.svg$/i,
						type: 'asset/source',
					},
					{
						test: /\.(png|jpg)$/i,
						type: 'asset/resource',
					}
				]
			}
		}
	}
});
