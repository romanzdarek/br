const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	//copy dist folder to server static, now location is dist/js
	plugins: [ new CopyPlugin([ { from: './dist', to: '../../../server/static' } ]) ]
});
