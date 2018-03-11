/**
 * Express est utilisé pour servir les fichiers statiques
 */
const express = require('express');
const app = express();

// const fs = require('fs');
const path = require('path');

module.exports = function(callback) {

	/**
	 * HTML
	 */
	app.get('/', function (req, res) {
		let dev = false;
		// En développement on recompile à chaque requête
		if (dev) {
			const compiler = require('./compiler.js');
			const config = require('./compiler-config.js');

			compiler.js(config.js, function() {
				compiler.css(config.css, function () {
					res.sendFile(path.resolve(__dirname+'/../index.html'));
				});
			});
		}
		else {
			res.sendFile(path.resolve(__dirname+'/../index.html'));
		}
	});


	// Fichiers statiques
	app.use('/dist', express.static('dist'));

	const port = 3003;

	app.listen(port);

	console.log('Le serveur écoute sur le port '+port);
	if (callback && typeof callback === 'function') {
		callback();
	}
}