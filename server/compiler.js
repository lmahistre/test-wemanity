const webpack = require('webpack');
const fs = require('fs');
const less = require('less');

/**
 * Bundles JS and JSX into one single file
 */
exports.js = function(configJs, callback) {
	const webpackCompiler = webpack(configJs);
	console.log('Compiling '+configJs.output.filename);
	try {
		webpackCompiler.run(function(err, stats) {
			try {
				if (err) {
					console.log('Compilation failed : '+configJs.output.filename);
					console.log(err);
				}
				else {
					console.log('Successfully compiled '+configJs.output.filename);
				}
				if (callback && typeof callback === 'function') {
					callback();
				}
			}
			catch (error) {
				console.log(error);
			}
		});
	}
	catch (error) {
		console.log(error);
	}
};


/**
 * Compiles LESS files into CSS
 */
exports.css =  function(configCss, callback) {
	console.log('Compiling '+configCss.outputFilename);

	try {
		fs.readFile(configCss.inputFolder+'/'+configCss.entry, { 
			encoding: 'utf8' 
		}, 
		function(err, data) {
			if (err) {
				console.log(err.stack);
			}
			less.render(data, {
				paths: [configCss.inputFolder+'/'], // Specify search paths for @import directives
				filename: './'+configCss.entry,
				compress: false // Minify CSS output
			},
			function (e, output) {
				if (e) {
					console.log(e.stack);
				}
				fs.writeFile(configCss.outputFolder+'/'+configCss.outputFilename, output.css, {
					flag:'w+', 
					encoding:'utf8'
				},
				function(err) {
					if (err != null) {
						console.log(err.stack);
					}
					else {
						console.log('Successfully compiled '+configCss.outputFilename);
						if (callback && typeof callback === 'function') {
							callback();
						}
					}
				});
			});
		});
	}
	catch(err) {
		console.log('Compilation failed : '+configCss.outputFilename);
		console.log(err.stack);
	}
};

