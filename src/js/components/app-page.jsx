
const React = require("react");

const Game = require('./game.jsx');
const Menu = require('./menu.jsx');

/**
 * Conteneur de la page
 */
class AppPage extends React.Component {

	constructor () {
		// Actions qui peuvent être appelée depuis l'interface
		this.actions = require('../services/actions.js');
	}


	startGame (data) {
		const self = this;
		this.setState(this.actions.startGame(data));
	}


	endGame () {
		this.setState(this.actions.endGame());
	}


	next () {
		this.setState(this.actions.next());
	}


	clickCell (cellId) {
		const self = this;
		return function () {
			self.setState(self.actions.clickCell(cellId));
		}
	}


	render() {
		const self = this;
		if (self.state && self.state.gameIsStarted) {
			return <Game game={self.state.game} actionNext={self.next.bind(self)} actionSelectCell={self.clickCell.bind(self)} actionEndGame={self.endGame.bind(self)} />;
		}
		else {
			return <Menu startGame={self.startGame.bind(self)} />;
		}
	}
}

module.exports = AppPage;