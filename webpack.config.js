// core Node.js module, allows us to use npm modules and require module
const path = require('path');
// importing webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// bc we're using webpack's methods and properties into config file, must import
const webpack = require('webpack');

// creating main configuration object
// basic configuration: entry, output, and mode
module.exports = {
	// entry property: entry point is root of the bundle and beginning of dependency graph, (giving it relative path to client's code)
	entry: {
		app: './assets/js/script.js',
		events: './assets/js/events.js',
		schedule: './assets/js/schedule.js',
		tickets: './assets/js/tickets.js'
	},
	// bundling into folder that we specify, best practice to put bundled code into folder named 'dist' short for distribution
	// name of each attribute in entry object will be used in place of [name] for each file created
	output: {
		filename: "[name].bundle.js",
		path: __dirname + "/dist",
	},
	module: {
		rules: [
			{
				// identifies type of files to pre-process using test property to find regex
				test: /\.jpg$/i,
				use: [
					{
						// file loader should go first to make sure it processess the images first so that image-webpack-loader can optimize the emitted files
						loader: 'file-loader',
						options: {
							// returning name of file with file extension
							esModule: false,
							name(file) {
								return '[path][name].[ext]'
							},
							// function that changes the assignment URL by replace ../ from the require statement to /assets/
							publicPath: function (url) {
								return url.replace('../', '/assets/')
							}
						}
					},
					{
						// adding another loader object
						loader: 'image-webpack-loader'
					}
				]
			}
		]
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
		// giving access to this package
		new BundleAnalyzerPlugin({
			// can also set mode to 'disable' to temporarily stop reporting and automatic opening of this report in the browser
			analyzerMode: 'static', // the report outputs to an HTML file in dist folder
		})
	],
	// default webpack wants to run in production mode, which'll minify our code for us automatically, along w other nice additions.
	// we want development tho
	mode: 'development'
};