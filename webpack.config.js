// core Node.js module, allows us to use npm modules and require module
const path = require('path');
// bc we're using webpack's methods and properties into config file, must import
const webpack = require('webpack');

// creating main configuration object
// basic configuration: entry, output, and mode
module.exports = {
	// entry property: entry point is root of the bundle and beginning of dependency graph, (giving it relative path to client's code)
	entry: './assets/js/script.js',
	// bundling into folder that we specify, best practice to put bundled code into folder named 'dist' short for distribution
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.bundle.js'
	},
	// plugins help direct webpack what to do
	plugins: [
		// defining $ and jquery variables to use installed npm package.
		// whenever working with libraries that are dependent on use of global variable i.e., $ and jquery, 
		// must tell webpack to make exceptions for these variables using webpack.ProvidePlugin 
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
	],
	// default webpack wants to run in production mode, which'll minify our code for us automatically, along w other nice additions.
	// we want development tho
	mode: 'development'
};