const React = require("react");
const ReactDOM = require("react-dom");
const AppPage = require("./components/app-page.jsx");

// Etat de l'application
exports.state = require('./state-container.js');


// Ouverture de la page
exports.init = function () {
	exports.render();
}


exports.render = function () {
	ReactDOM.render(
		<AppPage data={exports.state} />, 
		document.getElementById('react-root')
	);
}