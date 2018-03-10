const path = require('path');
const appDirName = path.resolve(__dirname+'/..');

module.exports = {
	js : {
		entry: appDirName+"/src/js/entry.js",
		output: {
			path: appDirName +'/dist',
			filename: "app.js"
		},
		module: {
			loaders: [
				{
					test: /\.jsx$/,
					loader: 'jsx-loader?insertPragma=React.DOM&harmony',
				},
			],
		},
	},
	css : {
		inputFolder : appDirName+'/src/less',
		entry : 'index.less',
		outputFolder : appDirName+'/dist',
		outputFilename : 'style.css',
	},
};