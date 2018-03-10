/**
 * Express is used for routing
 */
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

module.exports = function(callback) {
	/**
	 * Render main html page
	 */
	app.get('/', function (req, res) {
		res.sendFile(path.resolve(__dirname+'/../index.html'));
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