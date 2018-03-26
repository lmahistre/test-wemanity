
const interactionService = require('./interactions.mock.js');

describe ('state-manager', function() {
	const stateManager = require('../src/js/services/state-manager.js');
	stateManager.setDependencies({ interactionService });
		
	it ('startGame', function() {
		let state = stateManager.startGame();
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe('red');
		expect(state.game.cells['1-2'].owner).toBe(null);
		expect(state.game.cells['3-3'].owner).toBe('blue');
		expect(state.game.cells['1-1'].armies[0].number).toBe(10);

		state = stateManager.startGame(null, null, {
			rowNumber : 2,
			colNumber : 2,
		});
		expect(state.gameIsStarted).toBe(true);
		expect(state.game.turn).toBe(0);
		expect(state.game.currentPlayer).toBe('red');
		expect(state.game.cells['1-1'].owner).toBe('red');
		expect(state.game.cells['1-2'].owner).toBe(null);
		expect(state.game.cells['2-2'].owner).toBe('blue');
		expect(state.game.cells['1-1'].armies[0].number).toBe(10);
		expect(state.game.cells['2-2'].armies[0].number).toBe(10);
	})

	it ('next', function() {
		let state = stateManager.startGame();
		state = stateManager.next(state.gameIsStarted, state.game);
		expect(state.game.turn).toBe(0);
		expect(state.game.currentPlayer).toBe('blue');
		state = stateManager.next(state.gameIsStarted, state.game);
		expect(state.game.turn).toBe(1);
		expect(state.game.currentPlayer).toBe('red');
	})

	it ('clickCell', function() {
		let state = stateManager.startGame();
		state = stateManager.clickCell(state.gameIsStarted, state.game, '1-1');
		expect(state.game.selectedCell).toBe('1-1');
		state = stateManager.clickCell(state.gameIsStarted, state.game, '1-1');
		expect(state.game.selectedCell).toBe(null);
		state = stateManager.clickCell(state.gameIsStarted, state.game, '1-1');
		state = stateManager.clickCell(state.gameIsStarted, state.game, '1-2');
		expect(state.game.selectedCell).toBe(null);
		state = stateManager.clickCell(state.gameIsStarted, state.game, '1-1');
		state = stateManager.clickCell(state.gameIsStarted, state.game, '1-3');
		expect(state.game.selectedCell).toBe('1-1');
	})

	it ('endGame', function() {
		let state = stateManager.endGame();
		expect(state.gameIsStarted).toBe(false);
		expect(state.game).toEqual({});
	})
})
