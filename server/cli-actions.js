
/**
 * Les actions qui peuvent être exécutées en ligne de commande sont définies ici
 */

/**
 * Compilation CSS
 */
exports.css = function(args) {
	const compiler = require('./compiler.js');
	const config = require('./compiler-config.js');
	compiler.css(config.css);
}


/**
 * Transpilation JS
 */
exports.js = function(args) {
	const compiler = require('./compiler.js');
	const config = require('./compiler-config.js');
	compiler.js(config.js);
}


/**
 * Compilation JS et CSS
 */
exports.compile = function(args) {
	const compiler = require('./compiler.js');
	const config = require('./compiler-config.js');

	compiler.js(config.js, function() {
		compiler.css(config.css);
	});
}


/**
 * Compilation JS et CSS
 */
exports.build = function(args) {
	const compiler = require('./compiler.js');
	const config = require('./compiler-config.js');

	compiler.js(config.js, function() {
		compiler.css(config.css, function() {
			exports.test();
		});
	});
}


/**
 * Tests unitaires
 */
exports.test = function(args) {
	var Jasmine = require('jasmine');
	var jasmine = new Jasmine();

	jasmine.loadConfig({
		spec_dir: 'tests',
		spec_files: [
			'game-rules.spec.js',
			'old.spec.js',
			'state-manager.spec.js',
		],
		helpers: [
			// 'helpers/**/*.js'
		]
	});

	jasmine.onComplete(function(passed) {
		console.log(' --- ')
		if(passed) {
			console.log('Tous les tests passent');
		}
		else {
			console.log('Au moins un test a échoué');
		}
	});

	jasmine.execute();
}


/**
 * Démarre le server
 */
exports.server = function(args) {
	const server = require('./server.js')();
}

/**
 * Action par défaut :
 * Démarre le serveur
 */
exports.default = exports.server;