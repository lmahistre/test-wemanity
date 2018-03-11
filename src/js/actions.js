/**
 * Gère les actions
 * A chaque appel, on récupère l'état de l'application, on appelle la fonction 
 * qui gère les règles spécifique à l'action, puis on renvoie le nouvel état
 */

const stateManager = require('./state-manager.js')
const stateContainer = require('./state-container.js')

// Les appels aux fonctions du StateManager se passent toujours de la même façon
// donc on peut factoriser le code de ces appels
const generic = function (functionName) {
	if (typeof stateManager[functionName] === 'function') {
		// { gameIsStarted, game } = stateContainer.getState();
		// Webpack ne semble pas gérer l'affectation par décomposition
		return function (arg) {
			// Récupère l'état avant opération
			const state = stateContainer.getState();
			// Application des règles fonctionnelles
			const newState = stateManager[functionName](state.gameIsStarted, state.game, arg);
			// On enregistre l'état
			stateContainer.setState(newState);
			// on renvoie le nouvel état pour mettre à jour l'interface
			return stateContainer.getState();
		}
	}
	else {
		return stateContainer.getState;
	}
}

// Cette liste contient toutes les fonctions du StateManager qu'on peut appeler 
// depuis l'interface
const callableFunctions = ['startGame', 'next', 'endTurn', 'endGame', 'selectCell']
for (let i = 0; i < callableFunctions.length; i++) {
	exports[callableFunctions[i]] = function (arg) {
		return generic(callableFunctions[i])(arg);
	}
}

// Ca évite de devoir tout répéter

// // Début d'une nouvelle partie
// exports.startGame = function () {
// 	const state = stateContainer.getState();
// 	stateContainer.setState(stateManager.startGame(state.gameIsStarted, state.game))
// 	return stateContainer.getState();
// }


// // Fin de tour pour un joueur
// exports.next = function () {
// 	const state = stateContainer.getState();
// 	stateContainer.setState(stateManager.next(state.gameIsStarted, state.game))
// 	return stateContainer.getState();
// }


// // Fin de tour
// exports.endTurn = function () {
// 	const state = stateContainer.getState();
// 	stateContainer.setState(stateManager.endTurn(state.gameIsStarted, state.game));
// 	return stateContainer.getState();
// }


// // Fin de partie
// exports.endGame = function () {
// 	stateContainer.setState(stateManager.endGame());
// 	return stateContainer.getState();
// }


// // Clic sur une cellule
// exports.selectCell = function (cellId) {
// 	const state = stateContainer.getState();
// 	stateContainer.setState(stateManager.selectCell(state.gameIsStarted, state.game, cellId));
// 	return stateContainer.getState();
// }