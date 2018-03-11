/**
 * Effectue des actions sur l'état de l'application
 * Les règles de gestion sont ici
 * Il n'y a que des fonctions pures pour les tests unitaires
 */

/**
 * Début de la partie
 */
exports.startGame = function (gameIsStarted, game) {
	gameIsStarted = true;
	game = {
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
		cells : {
			'1-1' : {
				owner : 'red',
				neighbors : ['1-2','2-1'],
				armies : [
					{
						owner : 'red',
						number : 10,
						origin : '1-1',
					}
				],
			},
			'1-2' : {
				owner : null,
				neighbors : ['1-1','1-3','2-2'],
				armies : [],
			},
			'1-3' : {
				owner : null,
				neighbors : ['1-2','2-3'],
				armies : [],
			},
			'2-1' : {
				owner : null,
				neighbors : ['1-1','2-2','3-1'],
				armies : [],
			},
			'2-2' : {
				owner : null,
				neighbors : ['1-2','2-1','2-3','3-2'],
				armies : [],
			},
			'2-3' : {
				owner : null,
				neighbors : ['1-3','2-2','3-3'],
				armies : [],
			},
			'3-1' : {
				owner : null,
				neighbors : ['2-1','3-2'],
				armies : [],
			},
			'3-2' : {
				owner : null,
				neighbors : ['2-2','3-1','3-3'],
				armies : [],
			},
			'3-3' : {
				owner : 'blue',
				neighbors : ['2-3','3-2'],
				armies : [
					{
						owner : 'blue',
						number : 10,
						origin : '3-3',
					}
				],
			},
		},
	}
	return {gameIsStarted, game}
}


// Fin de tour pour un joueur
exports.next = function (gameIsStarted, game) {
	if (game.currentPlayer === 'red') {
		game.currentPlayer = 'blue';
		return {gameIsStarted, game};
	}
	else {
		return exports.endTurn(gameIsStarted, game);
	}
}


// Fin de tour
exports.endTurn = function (gameIsStarted, game) {
	// On vérifie le contenu de chaque cellule
	for (let cellId in game.cells) {
		if (game.cells[cellId].armies.length > 0) {
			let armiesByPlayer = {}
			// D'abord on regroupe les armées d'un même joueur
			for (let j=0; j<game.cells[cellId].armies.length; j++) {
				if (!armiesByPlayer[game.cells[cellId].armies[j].owner]) {
					armiesByPlayer[game.cells[cellId].armies[j].owner] = 0;
				}
				armiesByPlayer[game.cells[cellId].armies[j].owner] += game.cells[cellId].armies[j].number;
			}
			// reinitialisation de la cellule pour mettre de l'ordre
			game.cells[cellId].armies = [];
			for (let playerId in armiesByPlayer) {
				if (armiesByPlayer[playerId] > 0) {
					game.cells[cellId].armies.push({
						owner : playerId,
						origin : cellId,
						number : armiesByPlayer[playerId],
					})
				}
			}
			if (game.cells[cellId].armies.length > 1) {
				// combat
				if (game.cells[cellId].armies[0].number > game.cells[cellId].armies[1].number) {
					game.cells[cellId].armies[0].number -= game.cells[cellId].armies[1].number;
					game.cells[cellId].owner = game.cells[cellId].armies[0].owner;
					game.cells[cellId].armies.splice(1,1);
				}
				else if (game.cells[cellId].armies[0].number < game.cells[cellId].armies[1].number) {
					game.cells[cellId].armies[1].number -= game.cells[cellId].armies[0].number;
					game.cells[cellId].owner = game.cells[cellId].armies[1].owner;
					game.cells[cellId].armies.splice(0,1);
				}
				// Cas d'égalité
				else {
					game.cells[cellId].armies = []
				}
			}
			else if (game.cells[cellId].armies.length > 0) {
				game.cells[cellId].owner = game.cells[cellId].armies[0].owner;
			}
		}
		else {
			game.cells[cellId].owner = null;
		}
	}

	// Après les réorganisations et les combats, on donne des nouveaux soldats
	// et on vérifie si il reste les 2 joueurs
	let remainingPlayers = [];
	for (let cellId in game.cells) {
		if (game.cells[cellId].owner && game.cells[cellId].armies.length > 0) {
			game.cells[cellId].armies[0].number++;
			// Pour compter les joueurs restants
			if (remainingPlayers.indexOf(game.cells[cellId].owner) == -1) {
				remainingPlayers.push(game.cells[cellId].owner);
			}
		}
		else {
			game.cells[cellId].owner = null;
		}
	}

	game.turn++;
	if (remainingPlayers.length > 1) {
		game.currentPlayer = 'red';
	}
	else {
		game.currentPlayer = remainingPlayers[0];
		alert(game.players[remainingPlayers[0]].name + " a gagné")
		return exports.endGame();
	}
	return {gameIsStarted, game};
}


// Clic sur une cellule
exports.selectCell = function (gameIsStarted, game, cellId) {
	// Si il y a déjà une cellule sélectionnée, on doit choisir une cellule de destination
	if (game.selectedCell) {
		let originCell = game.cells[game.selectedCell];
		let destinationCell = game.cells[cellId];
		if (game.selectedCell == cellId) {
			game.selectedCell = null;
		}
		else if (originCell.neighbors.indexOf(cellId) > -1) {
			let max = 0;
			for (let i=0; i<originCell.armies.length; i++) {
				if (originCell.owner === originCell.armies[i].owner && originCell.armies[i].origin === game.selectedCell) {
					max += originCell.armies[i].number;
				}
			}
			let toSend = parseInt(prompt(`Nombre à envoyer (max : ${max}) :`));
			if (toSend && toSend > 0) {
				toSend = Math.min(max, toSend);
				// on crée une armée dans la cellule de destination
				destinationCell.armies.push({
					origin : game.selectedCell,
					number : toSend,
					owner : originCell.owner,
				});
				// on enlève les soldats dans la cellule d'origine
				for (var i = 0; i < originCell.armies.length; i++) {

					if (originCell.owner === originCell.armies[i].owner && originCell.armies[i].origin === game.selectedCell) {
						if (toSend > originCell.armies[i].number) {
							toSend -= originCell.armies[i].number;
							originCell.armies[i] = 0;
						}
						else {
							originCell.armies[i].number -= toSend;
							toSend = 0;
						}
					}
				}
			}
			game.selectedCell = null;
		}
	}
	// Si il n'y a pas de cellule sélectionnée, on en sélectionne une si on le peut
	else {
		// Un joueur ne peut sélectionner que ses propres cellules
		if (game.cells[cellId].owner === game.currentPlayer) {
			game.selectedCell = cellId;
		}
		else {
			game.selectedCell = null;
		}
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