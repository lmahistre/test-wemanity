/**
 * Intialise l'interface
 */
const React = require("react");
const ReactDOM = require("react-dom");

const App = require("./app.jsx");

window.onload = function () {
	ReactDOM.render(
		<App />, 
		document.getElementById('react-root')
	);
}