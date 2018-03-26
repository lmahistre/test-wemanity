
const interactionService = require('./interactions.mock.js');

describe('game rules', function () {
	const gameRulesService = require('../src/js/services/game-rules.js');
	gameRulesService.setDependencies({ interactionService });

	it ('generateCells', function () {
		expect(gameRulesService.generateCells(3,3)['1-1'].owner).toBe(null);
		expect(gameRulesService.generateCells(3,3)['1-1'].neighbors).toEqual(['1-2','2-1']);
		expect(gameRulesService.generateCells(3,3)['1-1'].armies).toEqual([]);
	})

	
	it ('countValues', function() {
		expect(gameRulesService.countValues({ 
			a : null,
			b : 'stg',
		})).toBe(2);
	})


	it ('initializePlayers', function() {
		let cells = {
			'1-1' : {
				owner : null,
				armies : [],
			},
			'1-2' : {
				owner : null,
				armies : [],
			},
			'1-3' : {
				owner : null,
				armies : [],
			},
		}
		expect(gameRulesService.initializePlayers(cells)['1-1'].owner).toBe('red');
		expect(gameRulesService.initializePlayers(cells)['1-1'].armies[0]).toEqual({
			owner : 'red',
			number : 10,
			origin : '1-1',
		});
		expect(gameRulesService.initializePlayers(cells)['1-2'].owner).toBe(null);
		expect(gameRulesService.initializePlayers(cells)['1-2'].armies).toEqual([]);
		expect(gameRulesService.initializePlayers(cells)['1-3'].owner).toBe('blue');
		expect(gameRulesService.initializePlayers(cells)['1-3'].armies[0]).toEqual({
			owner : 'blue',
			number : 10,
			origin : '1-3',
		});
	})


	it ('selectCell', function() {
		let game = {
			currentPlayer : 'red',
			cells : {
				'1-1' : {
					owner : 'red',
					armies : [],
				},
				'1-2' : {
					owner : null,
					armies : [],
				},
				'1-3' : {
					owner : null,
					armies : [],
				},
			},
			selectedCell : null,
		}
		expect(gameRulesService.selectCell(game, '1-1').selectedCell).toBe('1-1');
		expect(gameRulesService.selectCell(game, '1-2').selectedCell).toBe(null);
		expect(gameRulesService.selectCell(game, '1-3').selectedCell).toBe(null);
	})


	it ('moveToCell', function() {
		let game = {
			currentPlayer : 'red',
			cells : {
				'1-1' : {
					owner : 'red',
					neighbors : ['1-2'],
					armies : [
						{
							owner : 'red',
							number : 10,
							origin : '1-1',
						},
					],
				},
				'1-2' : {
					owner : null,
					neighbors : ['1-1','1-3'],
					armies : [],
				},
				'1-3' : {
					owner : null,
					neighbors : ['1-2'],
					armies : [
						{
							owner : 'blue',
							number : 10,
							origin : '1-3',
						}
					],
				},
			},
			selectedCell : '1-1',
		}
		// Meme cellule
		expect(gameRulesService.moveToCell(game, '1-1').selectedCell).toBe(null);
		expect(gameRulesService.moveToCell(game, '1-1').cells).toEqual(game.cells);
		// Cellule non adjacente
		expect(gameRulesService.moveToCell(game, '1-3').selectedCell).toBe('1-1');
		expect(gameRulesService.moveToCell(game, '1-3').cells).toEqual(game.cells);

		interactionService.setUserInput(4);
		expect(gameRulesService.moveToCell(game, '1-2').selectedCell).toBe(null);
		expect(gameRulesService.moveToCell(game, '1-2').cells['1-2'].armies).toEqual([
			{
				owner : 'red',
				number : 4,
				origin : '1-1',
			},
		]);
		expect(gameRulesService.moveToCell(game, '1-2').cells['1-1'].armies).toEqual([
			{
				owner : 'red',
				number : 6,
				origin : '1-1',
			},
		]);
	})

	it ('validateInt', function () {
		expect(gameRulesService.validateInt(2)).toBe(2);
		expect(gameRulesService.validateInt('2')).toBe(2);
		expect(gameRulesService.validateInt('2.3')).toBe(2);
		expect(gameRulesService.validateInt('')).toBe(0);
		expect(gameRulesService.validateInt()).toBe(0);
	})

	it ('addNewSoldiers', function() {
		let cells = {
			'1-1' : {
				owner : 'red',
				neighbors : ['1-2'],
				armies : [
					{
						owner : 'red',
						number : 10,
						origin : '1-1',
					},
				],
			},
			'1-2' : {
				owner : null,
				neighbors : ['1-1','1-3'],
				armies : [],
			},
			'1-3' : {
				owner : 'blue',
				neighbors : ['1-2'],
				armies : [
					{
						owner : 'blue',
						number : 10,
						origin : '1-3',
					}
				],
			},
		}
		expect(gameRulesService.addNewSoldiers(cells)).toEqual({
			'1-1' : {
				owner : 'red',
				neighbors : ['1-2'],
				armies : [
					{
						owner : 'red',
						number : 11,
						origin : '1-1',
					},
				],
			},
			'1-2' : {
				owner : null,
				neighbors : ['1-1','1-3'],
				armies : [],
			},
			'1-3' : {
				owner : 'blue',
				neighbors : ['1-2'],
				armies : [
					{
						owner : 'blue',
						number : 11,
						origin : '1-3',
					}
				],
			},
		});
	})

	it ('checkRemainingPlayers', function () {
		expect(gameRulesService.checkRemainingPlayers({
			'1-1' : {
				owner : 'red',
				neighbors : ['1-2'],
				armies : [
					{
						owner : 'red',
						number : 10,
						origin : '1-1',
					},
				],
			},
			'1-2' : {
				owner : null,
				neighbors : ['1-1','1-3'],
				armies : [],
			},
			'1-3' : {
				owner : 'blue',
				neighbors : ['1-2'],
				armies : [
					{
						owner : 'blue',
						number : 10,
						origin : '1-3',
					}
				],
			},
		})).toEqual(['red','blue']);

		expect(gameRulesService.checkRemainingPlayers({
			'1-1' : {
				owner : 'red',
				neighbors : ['1-2'],
				armies : [
					{
						owner : 'red',
						number : 10,
						origin : '1-1',
					},
				],
			},
			'1-2' : {
				owner : null,
				neighbors : ['1-1','1-3'],
				armies : [],
			},
			'1-3' : {
				owner : 'blue',
				neighbors : ['1-2'],
				armies : [],
			},
		})).toEqual(['red']);
	})

	it ('reorganize', function () {
		expect(gameRulesService.reorganize([
			{
				owner : 'red',
				number : 10,
				origin : '1-1',
			},
		], '2-3')).toEqual([
			{
				owner : 'red',
				number : 10,
				origin : '2-3',
			},
		]);

		expect(gameRulesService.reorganize([
			{
				owner : 'red',
				number : 10,
				origin : '1-3',
			},
			{
				owner : 'red',
				number : 3,
				origin : '2-1',
			},
		], '2-3')).toEqual([
			{
				owner : 'red',
				number : 13,
				origin : '2-3',
			},
		]);

		expect(gameRulesService.reorganize([
			{
				owner : 'red',
				number : 10,
				origin : '1-3',
			},
			{
				owner : 'red',
				number : 4,
				origin : '2-3',
			},
			{
				owner : 'blue',
				number : 3,
				origin : '2-1',
			},
		], '2-3')).toEqual([
			{
				owner : 'red',
				number : 14,
				origin : '2-3',
			},
			{
				owner : 'blue',
				number : 3,
				origin : '2-3',
			},
		]);
	})

	it ('fight', function() {
		expect(gameRulesService.fight({
			owner : 'red',
			neighbors : ['1-2'],
			armies : [
				{
					owner : 'red',
					number : 10,
					origin : '1-1',
				},
				{
					owner : 'blue',
					number : 8,
					origin : '1-1',
				},
			],
		})).toEqual({
			owner : 'red',
			neighbors : ['1-2'],
			armies : [
				{
					owner : 'red',
					number : 2,
					origin : '1-1',
				},
			],
		});

		expect(gameRulesService.fight({
			owner : 'red',
			neighbors : ['1-2'],
			armies : [
				{
					owner : 'red',
					number : 5,
					origin : '1-1',
				},
				{
					owner : 'blue',
					number : 8,
					origin : '1-1',
				},
			],
		})).toEqual({
			owner : 'blue',
			neighbors : ['1-2'],
			armies : [
				{
					owner : 'blue',
					number : 3,
					origin : '1-1',
				},
			],
		});

		expect(gameRulesService.fight({
			owner : 'red',
			neighbors : ['1-2'],
			armies : [
				{
					owner : 'red',
					number : 5,
					origin : '1-1',
				},
				{
					owner : 'blue',
					number : 5,
					origin : '1-1',
				},
			],
		})).toEqual({
			owner : 'red',
			neighbors : ['1-2'],
			armies : [],
		});
	})


	it ('endTurn', function() {
		let game = {
			currentPlayer : 'red',
			cells : {
				'1-1' : {
					owner : 'red',
					neighbors : ['1-2'],
					armies : [
						{
							owner : 'red',
							number : 10,
							origin : '1-1',
						},
					],
				},
				'1-2' : {
					owner : null,
					neighbors : ['1-1','1-3'],
					armies : [],
				},
				'1-3' : {
					owner : null,
					neighbors : ['1-2'],
					armies : [
						{
							owner : 'blue',
							number : 10,
							origin : '1-3',
						}
					],
				},
			},
			selectedCell : '1-1',
			turn : 1,
		}
		game = gameRulesService.endTurn(game);
		expect(game.currentPlayer).toBe('red');
		expect(game.turn).toBe(2);
		game = gameRulesService.endTurn(game);
		expect(game.currentPlayer).toBe('red');
		expect(game.turn).toBe(3);
	})
})
