
describe ('state-manager', function() {
	const stateManager = require('../src/js/state-manager.js');

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

		state = stateManager.endGame();
		expect(state.gameIsStarted).toBe(false);
		expect(state.game.turn).toBe(undefined);
		expect(state.game.currentPlayer).toBe(undefined);
	});
});