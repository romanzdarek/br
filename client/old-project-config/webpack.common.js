const path = require('path');

module.exports = {
	entry: {
		app: './src/app.ts',
		workerFindWater: './src/workerFindWater.ts'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist/js')
	},
	devServer: {
		port: 8888
	}
};
