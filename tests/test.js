
describe ('state-manager', function() {
	const stateManager = require('../src/js/state-manager.js');
	stateManager.interactions = require('./interactions.mock.js');

	it ("tests startGame then next", function() {
		let state = stateManager.startGame();
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe('red');
		expect(state.game.cells['1-2'].owner).toBe(null);
		expect(state.game.cells['3-3'].owner).toBe('blue');
		expect(state.game.cells['1-1'].armies[0].number).toBe(10);

		state = stateManager.next(state.gameIsStarted, state.game);
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.currentPlayer).toBe('blue');
		expect(state.game.cells['1-1'].armies[0].number).toBe(10);

		state = stateManager.next(state.gameIsStarted, state.game);
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(1);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].armies[0].number).toBe(11);

		state = stateManager.next(state.gameIsStarted, state.game);
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(1);
		expect(state.game.currentPlayer).toBe('blue');
		expect(state.game.cells['1-1'].armies[0].number).toBe(11);

		// Test de fin de partie
		state = stateManager.endGame();
		expect(state.gameIsStarted).toBe(false);
		expect(state.game.turn).toBe(undefined);
		expect(state.game.currentPlayer).toBe(undefined);
	});

	it ("tests moves to another cell", function() {
		let state = stateManager.startGame();
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe('red');
		expect(state.game.cells['1-2'].owner).toBe(null);
		expect(state.game.cells['3-3'].owner).toBe('blue');
		expect(state.game.cells['1-1'].armies[0].number).toBe(10);

		// Sélection d'une case de départ
		state = stateManager.selectCell(state.gameIsStarted, state.game, '1-1');
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.selectedCell).toBe('1-1');
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].armies[0].number).toBe(10);

		// Sélection d'une case d'arrivée
		// on y déplace 3 soldats :
		stateManager.interactions.setUserInput(3);
		state = stateManager.selectCell(state.gameIsStarted, state.game, '1-2');
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.selectedCell).toBe(null);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe('red');
		expect(state.game.cells['1-1'].armies[0].number).toBe(7);
		expect(state.game.cells['1-2'].owner).toBe(null);
		expect(state.game.cells['1-2'].armies[0].number).toBe(3);

		// On change de tour (on passe le tour de l'autre joueur)
		state = stateManager.next(state.gameIsStarted, state.game);
		state = stateManager.next(state.gameIsStarted, state.game);
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(1);
		expect(state.game.selectedCell).toBe(null);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe('red');
		expect(state.game.cells['1-1'].armies[0].number).toBe(8);
		expect(state.game.cells['1-2'].owner).toBe('red');
		expect(state.game.cells['1-2'].armies[0].number).toBe(4);
	});

	// Même test que précédemment mais on vide la première case
	it ("tests abandonning the first cell", function() {
		let state = stateManager.startGame();
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe('red');
		expect(state.game.cells['1-2'].owner).toBe(null);
		expect(state.game.cells['3-3'].owner).toBe('blue');
		expect(state.game.cells['1-1'].armies[0].number).toBe(10);

		// Sélection d'une case de départ
		state = stateManager.selectCell(state.gameIsStarted, state.game, '1-1');
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.selectedCell).toBe('1-1');
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].armies[0].number).toBe(10);

		// Sélection d'une case d'arrivée
		// on y déplace 10 soldats :
		stateManager.interactions.setUserInput(10);
		state = stateManager.selectCell(state.gameIsStarted, state.game, '1-2');
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.selectedCell).toBe(null);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe('red');
		expect(state.game.cells['1-1'].armies[0].number).toBe(0);
		expect(state.game.cells['1-2'].owner).toBe(null);
		expect(state.game.cells['1-2'].armies[0].number).toBe(10);

		// On change de tour (on passe le tour de l'autre joueur)
		state = stateManager.next(state.gameIsStarted, state.game);
		state = stateManager.next(state.gameIsStarted, state.game);
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(1);
		expect(state.game.selectedCell).toBe(null);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe(null);
		expect(state.game.cells['1-1'].armies[0]).toBe(undefined);
		expect(state.game.cells['1-2'].owner).toBe('red');
		expect(state.game.cells['1-2'].armies[0].number).toBe(11);
	});
});