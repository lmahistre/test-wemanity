/**
 * Contient l'état de l'application et gère les actions
 */
let gameIsStarted = false;
let game = {}


exports.getState = function() {
	return {
		gameIsStarted,
		game,
	}
}


exports.setState = function (state) {
	if (typeof state.gameIsStarted !== undefined) {
		gameIsStarted = state.gameIsStarted;
	}
	if (typeof state.game !== undefined) {
		game = state.game;
	}
}


exports.setGameIsStarted = function (value) {
	gameIsStarted = value;
}


exports.setGame = function (value) {
	game = value;
}


