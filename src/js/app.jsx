
const React = require("react");

const Game = require('./components/game.jsx');
const Menu = require('./components/menu.jsx');

/**
 * Conteneur de la page
 */
class AppPage extends React.Component {

	constructor () {
		// Actions qui peuvent être appelée depuis l'interface
		this.actions = require('./actions.js');
	}


	startGame () {
		this.setState(this.actions.startGame());
	}


	endGame () {
		this.setState(this.actions.endGame());
	}


	next () {
		this.setState(this.actions.next());
	}


	selectCell (cellId) {
		const self = this;
		return function () {
			self.setState(self.actions.selectCell(cellId));
		}
	}


	render() {
		const self = this;
		if (self.state && self.state.gameIsStarted) {
			return <Game game={self.state.game} actionNext={self.next.bind(self)} actionSelectCell={self.selectCell.bind(self)} actionEndGame={self.endGame.bind(self)} />;
		}
		else {
			return <Menu startGame={self.startGame.bind(self)} />;
		}
	}
}

module.exports = AppPage;