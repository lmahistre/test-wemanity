/**
 * Intialise l'interface
 */
const React = require("react");
const ReactDOM = require("react-dom");

const AppPage = require("./components/app-page.jsx");

window.onload = function () {
	ReactDOM.render(
		<AppPage />, 
		document.getElementById('react-root')
	);
}