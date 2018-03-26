/**
 * Effectue des actions sur l'état de l'application
 * Les règles de gestion sont ici
 * Il n'y a que des fonctions pures pour les tests unitaires
 */

const gameRulesService = require('./game-rules.js');

var interactionService;

exports.setDependencies = function (dependencies) {
	if (dependencies.interactionService) {
		interactionService = dependencies.interactionService;
		gameRulesService.setDependencies({ interactionService });
	}
}


/**
 * Début de la partie
 */
exports.startGame = function (gameIsStarted, game, data) {
	const defaultRowNumber = 3;
	const defaultColNumber = 3;
	let rowNumber, colNumber;
	if (data) {
		if (data.rowNumber) {
			rowNumber = gameRulesService.validateInt(data.rowNumber);
			rowNumber = rowNumber > 1 ? rowNumber : defaultRowNumber;
		}
		if (data.colNumber) {
			colNumber = gameRulesService.validateInt(data.colNumber);
			colNumber = colNumber > 1 ? colNumber : defaultColNumber;
		}
	}
	else {
		rowNumber = defaultRowNumber;
		colNumber = defaultColNumber;
	}

	gameIsStarted = true;
	game = {
		rowNumber : rowNumber,
		colNumber : colNumber,
		turn : 0,
		players : {
			red : {
				name : 'Rouge',
				color : 'red',
			},
			blue : {
				name : 'Bleu',
				color : 'blue',
			},
		},
		selectedCell : null,
		currentPlayer : 'red',
		cells : gameRulesService.generateCells(rowNumber, colNumber),
	}
	game.cells = gameRulesService.initializePlayers(game.cells);
	return {gameIsStarted, game}
}


// Fin de tour pour un joueur
exports.next = function (gameIsStarted, game) {
	if (game.currentPlayer === 'red') {
		game.currentPlayer = 'blue';
	}
	else {
		game = gameRulesService.endTurn(game);
	}
	return {gameIsStarted, game};
}


// Clic sur une cellule
exports.clickCell = function (gameIsStarted, game, cellId) {
	// Si il y a déjà une cellule sélectionnée, on doit choisir une cellule de destination
	if (game.selectedCell) {
		game = gameRulesService.moveToCell(game, cellId);
	}
	// Si il n'y a pas de cellule sélectionnée, on en sélectionne une si on le peut
	else {
		game = gameRulesService.selectCell(game, cellId);
	}
	return {gameIsStarted, game};
}


// Fin du jeu
exports.endGame = function () {
	return {
		gameIsStarted : false,
		game : {},
	}
}