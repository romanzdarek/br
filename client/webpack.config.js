const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.ts',
		workerFindWater: './src/workerFindWater.ts'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	devtool: 'source-map',
	devServer: {
		contentBase: './dist',
		port: 8888,
	},
	plugins: [
		//new HtmlWebpackPlugin({template: './src/index.html', inject: false,})
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist/js'),
		//clean: true, //clean dist folder!
	 	publicPath: './dist',

	},
};