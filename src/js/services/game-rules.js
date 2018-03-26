
var interactionService;

exports.setDependencies = function (dependencies) {
	if (dependencies.interactionService) {
		interactionService = dependencies.interactionService;
	}
}


exports.generateCells = function (rowNumber, colNumber) {
	let cells = {};
	for (r=1; r<=rowNumber; r++) {
		for (c=1; c<=colNumber; c++) {
			let cell = {
				owner : null,
				neighbors : [],
				armies : [],
			}
			if (r>1) {
				cell.neighbors.push((r-1)+'-'+c);
			}
			if (c>1) {
				cell.neighbors.push((r)+'-'+(c-1));
			}
			if (c<colNumber) {
				cell.neighbors.push((r)+'-'+(c+1));
			}
			if (r<rowNumber) {
				cell.neighbors.push((r+1)+'-'+c);
			}

			cells[r+'-'+c] = cell;
		}
	}
	return cells;
}


exports.countValues = function (obj) {
	let c = 0;
	for (let elt in obj) {
		c++;
	}
	return c;
}


exports.initializePlayers = function (cells) {
	let c = 0;
	let size = exports.countValues(cells);
	for (let cellId in cells) {
		c++;
		if (c === 1) {
			cells[cellId].owner = 'red';
			cells[cellId].armies.push({
				owner : cells[cellId].owner,
				number : 10,
				origin : cellId,
			})
		}
		if (c === size) {
			cells[cellId].owner = 'blue';
			cells[cellId].armies.push({
				owner : cells[cellId].owner,
				number : 10,
				origin : cellId,
			})
		}
	}
	return cells;
}


exports.selectCell = function (game, cellId) {
	// Un joueur ne peut sélectionner que ses propres cellules
	if (game.cells[cellId].owner === game.currentPlayer) {
		game.selectedCell = cellId;
	}
	else {
		game.selectedCell = null;
	}
	return game;
}


exports.moveToCell = function (inputGame, cellId) {
	let game = JSON.parse(JSON.stringify(inputGame));
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
		let toSend = parseInt(interactionService.prompt(`Nombre à envoyer (max : ${max}) :`));
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
	return game;
}


exports.validateInt = function (integer) {
	if (integer) {
		let i = parseInt(integer);
		if (isNaN(i)) {
			i = 0;
		}
		return i;
	}
	else {
		return 0;
	}
}


// Distribue des nouveaux soldats
exports.addNewSoldiers = function (inputCells) {
	let cells = JSON.parse(JSON.stringify(inputCells));
	for (let cellId in cells) {
		if (cells[cellId].owner && cells[cellId].armies.length > 0) {
			cells[cellId].armies[0].number++;
		}
		else {
			cells[cellId].owner = null;
		}
	}
	return cells;
}


exports.checkRemainingPlayers = function (inputCells) {
	let cells = JSON.parse(JSON.stringify(inputCells));
	let remainingPlayers = [];
	for (let cellId in cells) {
		if (cells[cellId].owner && cells[cellId].armies.length > 0) {
			// Pour compter les joueurs restants
			if (remainingPlayers.indexOf(cells[cellId].owner) == -1) {
				remainingPlayers.push(cells[cellId].owner);
			}
		}
	}
	return remainingPlayers;
}


exports.reorganizeAndFight = function (cells) {
	// On vérifie le contenu de chaque cellule
	for (let cellId in cells) {
		if (cells[cellId].armies.length > 0) {
			cells[cellId].armies = exports.reorganize(cells[cellId].armies, cellId);

			// Si il y a plusieurs armées c'est qu'elles sont ennemies
			if (cells[cellId].armies.length > 1) {
				// combat
				cells[cellId] = exports.fight(cells[cellId]);
			}
			else if (cells[cellId].armies.length > 0) {
				cells[cellId].owner = cells[cellId].armies[0].owner;
			}
		}
		// Pour gérer le cas où une cellule est abandonnée
		else {
			cells[cellId].owner = null;
		}
	}
	return cells;
}


exports.reorganize = function (inputArmies, cellId) {
	let armiesByPlayer = {}
	// D'abord on regroupe les armées d'un même joueur
	for (let j=0; j<inputArmies.length; j++) {
		if (!armiesByPlayer[inputArmies[j].owner]) {
			armiesByPlayer[inputArmies[j].owner] = 0;
		}
		armiesByPlayer[inputArmies[j].owner] += inputArmies[j].number;
	}
	// reinitialisation de la cellule pour mettre de l'ordre
	let armies = [];
	for (let playerId in armiesByPlayer) {
		if (armiesByPlayer[playerId] > 0) {
			armies.push({
				owner : playerId,
				origin : cellId,
				number : armiesByPlayer[playerId],
			})
		}
	}
	return armies;
}


exports.fight = function (inputCell) {
	let cell = JSON.parse(JSON.stringify(inputCell));
	if (cell.armies[0].number > cell.armies[1].number) {
		cell.armies[0].number -= cell.armies[1].number;
		cell.owner = cell.armies[0].owner;
		cell.armies.splice(1,1);
	}
	else if (cell.armies[0].number < cell.armies[1].number) {
		cell.armies[1].number -= cell.armies[0].number;
		cell.owner = cell.armies[1].owner;
		cell.armies.splice(0,1);
	}
	// Cas d'égalité
	else {
		cell.armies = []
	}
	return cell;
}


// Fin de tour
exports.endTurn = function (inputGame) {
	let game = JSON.parse(JSON.stringify(inputGame));
	game.cells = exports.reorganizeAndFight(game.cells);

	// Après les réorganisations et les combats, on donne des nouveaux soldats
	game.cells = exports.addNewSoldiers(game.cells);
	// et on vérifie si il reste les 2 joueurs
	const remainingPlayers = exports.checkRemainingPlayers(game.cells);

	game.turn++;
	if (remainingPlayers.length > 1) {
		game.currentPlayer = 'red';
	}
	else {
		game.currentPlayer = remainingPlayers[0];
		interactionService.alert(game.players[remainingPlayers[0]].name + " a gagné")
		return exports.endGame();
	}
	return game;
}