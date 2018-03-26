/**
 * Gère les actions
 * A chaque appel, on récupère l'état de l'application, on appelle la fonction 
 * qui gère les règles spécifique à l'action, puis on renvoie le nouvel état
 */

const stateManager = require('./state-manager.js')
stateManager.setDependencies({
	interactionService : require('./interactions.js'),
})
const stateContainer = require('./state-container.js')

// Les appels aux fonctions du StateManager se passent toujours de la même façon
// donc on peut factoriser le code de ces appels
const generic = function (functionName) {
	if (typeof stateManager[functionName] === 'function') {
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
const callableFunctions = ['startGame', 'next', 'endGame', 'clickCell']
for (let i = 0; i < callableFunctions.length; i++) {
	exports[callableFunctions[i]] = function (arg) {
		return generic(callableFunctions[i])(arg);
	}
}
